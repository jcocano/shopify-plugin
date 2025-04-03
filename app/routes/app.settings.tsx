import { ButtonUiEnum, LoaderUiEnum } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useBreakpoints, Page, BlockStack, Divider, InlineStack, ButtonGroup, Button } from "@shopify/polaris";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { getStoreSettings, updateStoreSettings } from "app/models/settings/Settings.server";
import { getShopDomain } from "app/utils/shopify/getShopDomain";
import { useState, useCallback, } from "react";

import { TimezoneSelector } from "app/components/settings/timezone/TimezoneSelector";
import { CustomizationSettings } from "app/components/settings/theme/CustomizationSettings";
import { authenticate } from "app/shopify.server";

export async function loader({ request, }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  const shopDomain = await getShopDomain(request)
  const storeSettings =  await getStoreSettings(shopDomain)

  console.log("store settings domain: ", shopDomain)
  console.log("store settings: ", storeSettings)

  return ({ storeSettings: storeSettings })
}

export async function action({ request }: ActionFunctionArgs) {
  const shopDomain = await getShopDomain(request);
  const formData = await request.formData();
  const storeSettingsDataString = formData.get("storeSettings");

  if (!storeSettingsDataString || typeof storeSettingsDataString !== "string") {
    throw new Error("Faltan los datos de storeSettings");
  }

  const storeSettingsData = JSON.parse(storeSettingsDataString) as Partial<StoreSettingsDto>;

  await updateStoreSettings(shopDomain, storeSettingsData);

  return redirect("/app/settings");
}

export default function Settings() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  
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
    const formData = new FormData();
    formData.append("storeSettings", JSON.stringify(newSettings));
    fetcher.submit(formData, { method: "post", action: `/app/settings` });
  };
    
  return (
    <Page
      title="Settings"
      primaryAction={{ content: "Save", onAction: handleSave }}
      secondaryActions={[
        { content: "Cancel", onAction: () => navigate(`/app/settings`) }
      ]}
    >
       <BlockStack gap={{ xs: "800", sm: "400" }}>
        <CustomizationSettings settingsData={newSettings} updateSettingsData={handleSettingsChange}/>
        {smUp ? <Divider /> : null}
        <TimezoneSelector settingsData={newSettings} updateSettingsData={handleSettingsChange}/>
        <InlineStack align="end">
          <ButtonGroup>
            <Button variant="secondary" onClick={() => navigate(`/app/settings`)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </ButtonGroup>
        </InlineStack>
        {smUp ? <Divider /> : null}
      </BlockStack>
    </Page>
  )
}
