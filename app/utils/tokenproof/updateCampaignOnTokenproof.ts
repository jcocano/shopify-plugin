import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { getStoreSettings } from "app/models/settings/Settings.server";
import { transformCampaignToPayload } from "./auxiliar/transformCampaignToPayload";
import { CreateCampaignDTO } from "./interfaces/tokenproofInterfaces";

export async function updateCampaignOnTokenproof(campaign: CampaignDto): Promise<string> {
  const settings = await getStoreSettings(campaign.shop);
  if (!settings || !settings.app_id || !settings.api_key) {
    throw new Error(`error getting settings: ${campaign.shop}`);
  }
  
  if (!campaign.id) {
    throw new Error(`error getting campaign: ${campaign.id}`);
  }
  
  const payload: CreateCampaignDTO = transformCampaignToPayload(campaign);
  const url = `${process.env.TOKENPROOF_API_URL}/shopify/${settings.app_id}/campaigns/${campaign.id}`;
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.api_key,
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error to update campaign on Tokenproof: ${errorText}`);
  }
  
  const data = await response.json();
  return data.policy;
}
