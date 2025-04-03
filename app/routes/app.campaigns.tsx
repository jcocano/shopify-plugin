import { Bleed, BlockStack, Box, Button, ButtonGroup, Card, InlineGrid, InlineStack, Page, Text } from '@shopify/polaris';
import { EditIcon, DeleteIcon, PauseCircleIcon, PlayCircleIcon } from '@shopify/polaris-icons';
import { useLoaderData, useFetcher, useNavigate, useSearchParams } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { getCampaigns, updateCampaign, deleteCampaign } from '../models/campaigns/Campaigns.server'
import { getShopDomain } from 'app/utils/shopify/getShopDomain';
import { CampaingsEmptySatate } from 'app/components/campaings/CampaignsEmptySatate';
import { deleteCampaignOnTokenproof } from 'app/utils/tokenproof/deleteCampaignOnTokenproof';
import { authenticate } from 'app/shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, redirect } = await authenticate.admin(request);

  const shopDomain = await getShopDomain(request);
  const campaigns = await getCampaigns(shopDomain);
  return campaigns;
}

export async function action({ request }: ActionFunctionArgs) {
  const {admin, redirect} = await authenticate.admin(request);

  const formData = await request.formData();
  const campaignId = String(formData.get('id'));
  const campaignAction = String(formData.get('action'));
  const shopDomain = await getShopDomain(request);

  if (!campaignId || !campaignAction) {
    throw new Response("Missing id or action in form data", { status: 400 });
  }

  try {
    switch (campaignAction) {
      case "activate":
        await updateCampaign(shopDomain, campaignId, { is_active: true });
        break;
      case "pause":
        await updateCampaign(shopDomain, campaignId, { is_active: false });
        break;
      case "delete":
        await deleteCampaignOnTokenproof(shopDomain, campaignId);
        await deleteCampaign(shopDomain, campaignId);
        break;
      default:
        throw new Response("Invalid action", { status: 400 });
    }
    
    return redirect("/app/campaigns");
  } catch (error) {
    console.error("Error in campaign action:", error);
    throw error;
  }
}

export default function Campaign() {
  const [searchParams] = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');
  
  const { result: campaigns, filterRecords, totalRecords } = useLoaderData<typeof loader>();
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

  if(!campaigns || campaigns.length === 0) {
    return <CampaingsEmptySatate/>
  }

  return (
    <Page
      title="Campaigns"
      subtitle="Your campaigns are ready to rock (and maybe roll)!"
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
        {campaigns.map((campaign, index) => (
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
