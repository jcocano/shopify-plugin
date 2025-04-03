import { 
  BlockStack, 
  Button, 
  ButtonGroup, 
  Divider, 
  InlineStack, 
  Page, 
  useBreakpoints 
} from "@shopify/polaris";

import { 
  ActionFunctionArgs, 
  LoaderFunctionArgs, 
  redirect 
} from "@remix-run/node";

import { 
  useFetcher, 
  useLoaderData, 
  useNavigate 
} from "@remix-run/react";

import { useState, useEffect } from "react";

import { 
  CampaignEnum, 
  DiscountEnum, 
  EvaluatedConditionEnum, 
  ProductSelectionEnum, 
  StatusEnum 
} from "@prisma/client";

import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { getCampaign } from "app/models/campaigns/Campaigns.server";

import { normalizeConditions, normalizeSelectedProducts } from "app/utils/campaign/normalizeData";
import { getShopDomain } from "app/utils/shopify/getShopDomain";

import { CampaignDetails } from "app/components/campaings/details/CampaignDetails";
import { ConditionDetails } from "app/components/campaings/conditions/ConditionDetails";
import { ProductDetails } from "app/components/campaings/products/ProductDetails";
import { CampaignLimits } from "app/components/campaings/limits/CampaignLimits";
import { syncCampaignData } from "app/utils/campaign/syncCampaignData";
import { authenticate } from "app/shopify.server";

interface FetcherData {
  redirect?: string;
  error?: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  try {
    const shopDomain = await getShopDomain(request);
    if (!params.id || params.id === "new") {
      return {
        isNew: true,
        campaign: null
      };
    }

    const campaign = await getCampaign(shopDomain, params.id);
    return {
      isNew: false,
      campaign
    };
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    throw new Response(
      JSON.stringify({ error: "Failed to load campaign" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const {admin, redirect} = await authenticate.admin(request);

  try {
    const shopDomain = await getShopDomain(request);
    const formData = await request.formData();
    const campaignData = JSON.parse(formData.get("campaign") as string);

    await syncCampaignData(campaignData, shopDomain);

    return new Response(
      JSON.stringify({ redirect: "/app/campaigns" }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        }
      }
    );
  } catch (error) {
    console.error("Error in campaign action:", error);
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    throw new Response(
      JSON.stringify({ error: "Failed to save campaign" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        } 
      }
    );
  }
}

export default function CampaignEditor() {
  const { smUp } = useBreakpoints();
  const { campaign, isNew } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<FetcherData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.redirect) {
      navigate(fetcher.data.redirect);
    }
  }, [fetcher.data, navigate]);

  const [campaignData, setCampaignData] = useState<CampaignDto>(() => {
    if (campaign) {
      return {
        ...campaign,
        offer_description: campaign.offer_description || "",
        product_purchase_limit: campaign.product_purchase_limit || 0,
        selected_products: normalizeSelectedProducts(campaign.selected_products),
        conditions: normalizeConditions(campaign.conditions)
      };
    }
    
    return {
      id: "",
      shop: "",
      title: "New Campaign",
      auth_policy: "",
      type: CampaignEnum.SPECIAL_DISCOUNT,
      discount_type: DiscountEnum.PERCENTAGE,
      discount: 0,
      offer_description: "",
      is_active: false,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      status: StatusEnum.DRAFT,
      is_auto_archive: false,
      product_selection_type: ProductSelectionEnum.ALL_PRODUCTS,
      selected_products: [],
      evaluated_condition: EvaluatedConditionEnum.ALL,
      conditions: [],
      product_purchase_limit: 0,
    };
  });

  const updateCampaignData = <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => {
    setCampaignData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("campaign", JSON.stringify(campaignData));
    fetcher.submit(formData, { 
      method: "post", 
      action: `/app/campaign/${isNew ? "new" : campaignData.id}`
    });
  };

  const handleCancel = () => {
    navigate('/app/campaigns');
  };
    
  return (
    <Page
      title={isNew ? "Setup your new Campaign" : `Edit Campaign: ${campaignData.title}`}
      primaryAction={{ 
        content: "Save", 
        onAction: handleSave,
        loading: fetcher.state === "submitting"
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleCancel,
        },
      ]}
    >
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <CampaignDetails
          campaignData={campaignData} 
          updateCampaignData={updateCampaignData}
        />
        {smUp ? <Divider /> : null}
        <ProductDetails
          campaignData={campaignData} 
          updateCampaignData={updateCampaignData}
        />
        {smUp ? <Divider /> : null}
        <CampaignLimits
          campaignData={campaignData} 
          updateCampaignData={updateCampaignData}
        />
        {smUp ? <Divider /> : null}
        <ConditionDetails
          campaignData={campaignData} 
          updateCampaignData={updateCampaignData}
        />
        <InlineStack align="end">
          <ButtonGroup>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={fetcher.state === "submitting"}>
              Save
            </Button>
          </ButtonGroup>
        </InlineStack>
      </BlockStack>
    </Page>
  );
}
