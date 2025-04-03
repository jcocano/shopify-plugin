import { ConditionTypeEnum, OperatorEnum } from "@prisma/client";

export interface CampaignConditionDto {
  id?: number;
  type: ConditionTypeEnum;
  operator: OperatorEnum;
  ruleName: string;
  tokenIds?: string[];
  tokenQty?: number;
  blockchain?: string;
  contract?: string;
  wallet?: string[];
}

export function createDefaultCampaignConditionDto(
  data?: Partial<CampaignConditionDto>
): CampaignConditionDto {
  return {
    id: data?.id,
    type: data?.type || ConditionTypeEnum.OWNS_TOKEN,
    operator: data?.operator || OperatorEnum.INCLUDES,
    ruleName: data?.ruleName || "",
    tokenIds: data?.tokenIds,
    tokenQty: data?.tokenQty,
    blockchain: data?.blockchain,
    contract: data?.contract,
    wallet: data?.wallet,
  };
}
