import { ConditionTypeEnum } from "@prisma/client";
import { CampaignTypes } from "../interfaces/tokenproofInterfaces";

export function mapConditionType(conditionType: ConditionTypeEnum): CampaignTypes {
  switch (conditionType) {
    case ConditionTypeEnum.OWNS_TOKEN:
      return CampaignTypes.OWNS_TOKEN;
    case ConditionTypeEnum.WALLET_LIST:
      return CampaignTypes.ACCOUNTS;
    default:
      throw new Error(`Unknown condition type: ${conditionType}`);
  }
}
