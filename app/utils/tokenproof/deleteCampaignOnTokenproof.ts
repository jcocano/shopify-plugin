import { getStoreSettings } from "app/models/settings/Settings.server";

export async function deleteCampaignOnTokenproof(shop: string, campaignId:string): Promise<void> {
  const settings = await getStoreSettings(shop);
  if (!settings || !settings.app_id || !settings.api_key) {
    throw new Error(`error getting settings: ${shop}`);
  }
  
  const url = `${process.env.TOKENPROOF_API_URL}/shopify/${settings.app_id}/campaigns/${campaignId}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.api_key,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error on delete campaign on Tokenproof: ${errorText}`);
  }
  
  return;
}
