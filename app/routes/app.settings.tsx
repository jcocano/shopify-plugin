import { ButtonUiEnum, LoaderUiEnum } from "@prisma/client";
import { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate, useRouteError } from "@remix-run/react";
import { useBreakpoints, Page, BlockStack, Divider, InlineStack, ButtonGroup, Button, Banner } from "@shopify/polaris";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { getStoreSettings, updateStoreSettings } from "app/models/settings/Settings.server";
import { useState, useCallback, useEffect } from "react";

import { TimezoneSelector } from "app/components/settings/timezone/TimezoneSelector";
import { CustomizationSettings } from "app/components/settings/theme/CustomizationSettings";
import { authenticate } from "app/shopify.server";
import { ErrorBoundary as CustomErrorBoundary } from "app/components/ErrorBoundary";
import { boundary } from "@shopify/shopify-app-remix/server";

export async function loader({ request, }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  console.log("Cookie recibida en loader:", cookieHeader);
  const { session } = await authenticate.admin(request);

  const storeSettings = await getStoreSettings(session.shop)
  
  return ({ storeSettings: storeSettings })
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { session } = await authenticate.admin(request);

    const formData = await request.formData();
    const storeSettingsDataString = formData.get("storeSettings");

    if (!storeSettingsDataString || typeof storeSettingsDataString !== "string") {
      throw new Error("Failed to get store settings data");
    }

    const storeSettingsData = JSON.parse(storeSettingsDataString) as Partial<StoreSettingsDto>;
    await updateStoreSettings(session.shop, storeSettingsData);

    return ({ success: true });
  
  } catch (error) {
    return ({ success: false, error: "Failed to update settings" });
  }
}

export default function Settings() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [showUpdatingBanner, setShowUpdatingBanner] = useState(false);
  
  const { storeSettings } = useLoaderData<typeof loader>();
  const { smUp } = useBreakpoints();

  const presetSettings:Partial<StoreSettingsDto> = {
    timezone: '',
    button_ui: ButtonUiEnum.BLUE,
    loader_ui: LoaderUiEnum.BLUE
  }

  const [newSettings, setNewSettings] = useState<Partial<StoreSettingsDto>>(() => {
    if (storeSettings) {
      return {
        ...presetSettings,
        ...storeSettings,
        timezone: storeSettings.timezone ?? presetSettings.timezone,
      };
    }
    return presetSettings;
  });

  useEffect(() => {
    if (fetcher.state === "submitting") {
      setShowSuccessBanner(false);
      setShowErrorBanner(false);
      setShowUpdatingBanner(true);
    } else if (fetcher.state === "idle" && fetcher.data) {
      console.log("Fetcher data:", fetcher.data);
      setShowUpdatingBanner(false);
      
      const data = fetcher.data as { success?: boolean; error?: string };
      
      if (data.success) {
        console.log("Showing success banner");
        setShowSuccessBanner(true);
        
        setTimeout(() => {
          setShowSuccessBanner(false);
        }, 4000);
      } else {
        console.log("Showing error banner");
        setShowErrorBanner(true);
        
        setTimeout(() => {
          setShowErrorBanner(false);
        }, 4000);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleSettingsChange = useCallback(
    async <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) => {
      setNewSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleSave = () => {
    console.log("Saving settings...");
    const formData = new FormData();
    formData.append("storeSettings", JSON.stringify(newSettings));
    fetcher.submit(formData, { method: "post", action: `/app/settings` });
  };
    
  return (
    <Page
      title="Settings"
      primaryAction={{ 
        content: "Save", 
        onAction: handleSave,
        disabled: fetcher.state === "submitting"
      }}
      secondaryActions={[
        { 
          content: "Cancel", 
          onAction: () => navigate(`/app/settings`),
          disabled: fetcher.state === "submitting"
        }
      ]}
    >
      <BlockStack gap="400">
        {showErrorBanner && (
          <Banner
            title="Error updating settings"
            tone="critical"
            onDismiss={() => setShowErrorBanner(false)}
          >
            An error occurred, please try again later
          </Banner>
        )}
        
        {showUpdatingBanner && (
          <Banner
            title="Updating settings"
            tone="info"
            onDismiss={() => setShowUpdatingBanner(false)}
          >
            Your settings are being updated...
          </Banner>
        )}
        
        {showSuccessBanner && (
          <Banner
            title="Settings updated"
            tone="success"
            onDismiss={() => setShowSuccessBanner(false)}
          >
            Your settings were successfully updated
          </Banner>
        )}
      </BlockStack>
      
      <div style={{ marginTop: '16px' }}></div>
      
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <CustomizationSettings settingsData={newSettings} updateSettingsData={handleSettingsChange}/>
        {smUp ? <Divider /> : null}
        <TimezoneSelector settingsData={newSettings} updateSettingsData={handleSettingsChange}/>
        <InlineStack align="end">
          <ButtonGroup>
            <Button 
              variant="secondary" 
              onClick={() => navigate(`/app/settings`)}
              disabled={fetcher.state === "submitting"}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={fetcher.state === "submitting"}
              loading={fetcher.state === "submitting"}
            >
              Save
            </Button>
          </ButtonGroup>
        </InlineStack>
        {smUp ? <Divider /> : null}
      </BlockStack>
    </Page>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Settings error boundary caught:", error);

  return (
    <CustomErrorBoundary 
      error={error instanceof Error ? error : new Error("Unknown error")}
      componentStack={error instanceof Error ? error.stack : undefined}
    />
  );
};

export const headers: HeadersFunction = (args) => {
  return boundary.headers(args);
};
