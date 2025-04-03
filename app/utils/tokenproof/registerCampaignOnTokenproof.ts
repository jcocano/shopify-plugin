import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { getStoreSettings } from "app/models/settings/Settings.server";
import { CreateCampaignDTO } from "./interfaces/tokenproofInterfaces";
import { transformCampaignToPayload } from "./auxiliar/transformCampaignToPayload";

export async function registerCampaignOnTokenproof(campaign: CampaignDto): Promise<string> {
  const settings = await getStoreSettings(campaign.shop);
  if (!settings || !settings.app_id || !settings.api_key) {
    throw new Error(`error getting settings: ${campaign.shop}`);
  }

  const payload: CreateCampaignDTO = transformCampaignToPayload(campaign);

  const url = `${process.env.TOKENPROOF_API_URL}/shopify/${settings.app_id}/campaigns`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.api_key,
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Error obtaining auth policy: ${err}`);
  }
  
  const data = await response.json();

  return data.id;
}
