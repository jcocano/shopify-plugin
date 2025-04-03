import { updateCampaign, createCampaign } from "app/models/campaigns";
import { registerCampaignOnTokenproof } from "../tokenproof/registerCampaignOnTokenproof";
import { updateCampaignOnTokenproof } from "../tokenproof/updateCampaignOnTokenproof";
import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";


export async function syncCampaignData(campaign: CampaignDto, shopDomain: string): Promise<void> {
  if (!campaign.id) {
    // create campaign on tokenproof 
    const authPolicy = await registerCampaignOnTokenproof({
      ...campaign,
      shop: shopDomain,
    });
    // create campaign on db
    await createCampaign({
      ...campaign,
      shop: shopDomain,
      auth_policy: authPolicy,
      is_active: true,
    });
  } else {
    // update campaign on tokenproof
    const updatedPolicy = await updateCampaignOnTokenproof({
      ...campaign,
      shop: shopDomain,
    });
    // update campaign on local db
    await updateCampaign(shopDomain, campaign.id, {
      ...campaign,
      auth_policy: updatedPolicy,
      is_active: true,
    });
  }
}
    