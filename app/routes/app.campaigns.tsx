import { Bleed, BlockStack, Box, Button, ButtonGroup, Card, InlineGrid, InlineStack, Page, Text } from '@shopify/polaris';
import { EditIcon, DeleteIcon, PauseCircleIcon, PlayCircleIcon } from '@shopify/polaris-icons';
import { useLoaderData, useFetcher, useNavigate, useSearchParams, useRouteError } from '@remix-run/react';
import { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { getCampaigns, updateCampaign, deleteCampaign } from '../models/campaigns/Campaigns.server'
import { CampaingsEmptySatate } from 'app/components/campaings/CampaignsEmptySatate';
import { deleteCampaignOnTokenproof } from 'app/utils/tokenproof/deleteCampaignOnTokenproof';
import { authenticate } from 'app/shopify.server';
import { CampaignDto } from 'app/models/dtos/campaigns/Campaign.dto';

import { ErrorBoundary as CustomErrorBoundary } from "app/components/ErrorBoundary";
import { boundary } from "@shopify/shopify-app-remix/server";


export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
 
  const campaigns = await getCampaigns(session.shop);
  return JSON.stringify(campaigns);
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("campaigns action")
  const { session, redirect } = await authenticate.admin(request);

  const formData = await request.formData();
  const campaignId = String(formData.get('id'));
  const campaignAction = String(formData.get('action'));

  if (!campaignId || !campaignAction) {
    throw new Error("Missing id or action in form data");
  }

  switch (campaignAction) {
    case "activate":
      await updateCampaign(session.shop, campaignId, { is_active: true });
      break;
    case "pause":
      await updateCampaign(session.shop, campaignId, { is_active: false });
      break;
    case "delete":
      await deleteCampaignOnTokenproof(session.shop, campaignId);
      await deleteCampaign(session.shop, campaignId);
      break;
    default:
      throw new Error("Invalid action");
  }
    
  return redirect("/app/campaigns");
}

export default function Campaign() {
  const [searchParams] = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');
  
  const campaignsData = JSON.parse(useLoaderData<typeof loader>());
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const getUrlWithParams = (path: string) => {
    const params = new URLSearchParams();
    if (shop) params.append('shop', shop);
    if (host) params.append('host', host);
    return `${path}?${params.toString()}`;
  };

  const handleCampaignAction = (id: string, action: "pause" | "activate" | "delete") => {
    if (fetcher.state === "submitting") return;

    const formData = new FormData();
    formData.append('id', id);
    formData.append('action', action);
    if (shop) formData.append('shop', shop);
    if (host) formData.append('host', host);
    
    fetcher.submit(formData, { 
      method: "post",
      action: "/app/campaigns"
    });
  };

  const handleNewCampaign = () => {
    navigate(getUrlWithParams('/app/campaign/new'));
  };

  const handleEditCampaign = (id: string) => {
    navigate(getUrlWithParams(`/app/campaign/${id}`));
  };

  if(!campaignsData.result || campaignsData.result.length === 0) {
    return <CampaingsEmptySatate/>
  }

  return (
    <Page
      title="Campaigns"
      subtitle="Your campaigns are ready to rock!"
      compactTitle
      primaryAction={{
        content: 'New campaign', 
        disabled: fetcher.state === "submitting",
        onAction: handleNewCampaign,
      }}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <BlockStack gap="400">
        {campaignsData.result.map((campaign: CampaignDto, index: number) => (
          <Card key={index} roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingXl">
                  {campaign.title}
                </Text>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    tone={campaign.is_active ? undefined : "success"}
                    icon={campaign.is_active ? PauseCircleIcon : PlayCircleIcon}
                    accessibilityLabel={campaign.is_active ? "Pause" : "Activate"}
                    onClick={() => handleCampaignAction(campaign.id ?? '', campaign.is_active ? "pause" : "activate")}
                    loading={fetcher.state === "submitting"}
                    disabled={fetcher.state === "submitting"}
                  />
                  <Button 
                    icon={EditIcon} 
                    accessibilityLabel="Edit campaign"
                    onClick={() => handleEditCampaign(campaign.id ?? '')}
                    disabled={fetcher.state === "submitting"}
                  />
                </ButtonGroup>
              </InlineGrid>
              <BlockStack gap="400">
                <Text as="p" variant="bodyMd">
                  {campaign.offer_description}
                </Text>
              </BlockStack>
              <Bleed marginInline="400">
                <Box
                  background="bg-surface-secondary"
                  paddingBlock="300"
                  paddingInline="400"
                >
                  <InlineGrid columns={2}>
                    <BlockStack gap="400">
                      <BlockStack>
                        <Text as="h3" variant="headingSm" fontWeight="medium">Products</Text>
                        <Text as="p" variant="bodySm" fontWeight="regular">{campaign.selected_products[0]?.title}</Text>
                        <Text as="p" variant="bodySm" fontWeight="regular">Product variant2</Text>
                      </BlockStack>
                      <BlockStack>
                        <Text as="h3" variant="headingSm" fontWeight="medium">Start Date</Text>
                        <Text as="p" variant="bodySm" fontWeight="regular">
                          {new Date(campaign.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </BlockStack>
                    </BlockStack>
                    <BlockStack gap="400">
                      <BlockStack>
                        <Text as="h3" variant="headingSm" fontWeight="medium">Eligibility Conditions</Text>
                        <Text as="p" variant="bodySm" fontWeight="regular">
                          {campaign.conditions[0]?.operator + ' ' + campaign.conditions[0]?.wallet}
                        </Text>
                      </BlockStack>
                      <BlockStack>
                        <Text as="h3" variant="headingSm" fontWeight="medium">End Date</Text>
                        <Text as="p" variant="bodySm" fontWeight="regular">
                          {new Date(campaign.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </BlockStack>
                    </BlockStack>
                  </InlineGrid>
                </Box>
              </Bleed>
              <BlockStack gap="200">
                <InlineStack align="end">
                  <Button 
                    variant="primary" 
                    icon={DeleteIcon} 
                    tone='critical' 
                    accessibilityLabel="delete campaign"
                    onClick={() => handleCampaignAction(campaign.id ?? '', "delete")}
                    loading={fetcher.state === "submitting"}
                    disabled={fetcher.state === "submitting"}
                  />
                </InlineStack>
              </BlockStack>
            </BlockStack>
          </Card>
        ))}
      </BlockStack>
    </Page>
  );
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

