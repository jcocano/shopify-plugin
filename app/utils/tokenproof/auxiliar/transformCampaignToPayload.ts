import { CampaignCondition, CampaignConditionAccounts, CampaignConditionOwnsToken, CampaignTypes, CreateCampaignDTO } from "../interfaces/tokenproofInterfaces";
import { mapConditionType } from "./mapConditionType";
import { mapOperatorType } from "./mapOperatorType";
import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";

export function transformCampaignToPayload(campaign: CampaignDto): CreateCampaignDTO {
  const conditionsArray: CampaignCondition[] = (campaign.conditions ?? []).map(condition => {
    const mappedType = mapConditionType(condition.type);

    if (mappedType === CampaignTypes.ACCOUNTS) {
      const operatorMapped = condition.operator ? mapOperatorType(condition.operator) : "in";
      const walletValue: string = Array.isArray(condition.wallet)
        ? condition.wallet.join(",")
        : typeof condition.wallet === "string"
          ? condition.wallet
          : "";
      return {
        campaignName: campaign.title,
        type: 'account',
        operator: operatorMapped,
        value: walletValue,
      } as CampaignConditionAccounts;
    } else if (mappedType === CampaignTypes.OWNS_TOKEN) {
      const tokenIdsValue = Array.isArray(condition.tokenIds)
        ? condition.tokenIds.join(",")
        : typeof condition.tokenIds === "string"
          ? condition.tokenIds
          : "";

      const quantity = (!condition.tokenQty || condition.tokenQty < 1) ? 1 : condition.tokenQty;
      
      return {
        campaignName: condition.ruleName ?? "",
        type: mappedType,
        operator: "equal",
        value: true,
        tokenIds: tokenIdsValue,
        params: {
          blockchain: (condition.blockchain ?? "").toLowerCase(),
          contractAddress: condition.contract ?? "",
          token_id: tokenIdsValue,
          quantity,
          alias: condition.ruleName ?? ""
        }
      } as CampaignConditionOwnsToken;
    } else {
      throw new Error(`Unknown mappedType: ${mappedType}`);
    }
  });

  return {
    campaignName: `${campaign.shop}-${campaign.title}`,
    evaluateConditions: campaign.evaluated_condition.toLowerCase(),
    conditions: conditionsArray
  };
}
