export enum CampaignTypes {
  ACCOUNTS = 'account',
  OWNS_TOKEN = 'ownsToken',
}

export enum OperatorTypeEnum {
  INCLUDES = "in",
  EXCLUDES = "notIn",
}

export interface CampaignBase {
  campaignName: string;
  type: CampaignTypes;
}

export interface CampaignBase {
  campaignName: string;
  type: CampaignTypes;
}

export interface CampaignConditionAccounts extends CampaignBase {
  type: CampaignTypes.ACCOUNTS;
  operator: string;
  value: string; // Arreglo de direcciones
}

export interface CampaignConditionOwnsToken extends CampaignBase {
  type: CampaignTypes.OWNS_TOKEN;
  operator: string;
  value: true;
  params: {
    blockchain: string;
    contractAddress: string;
    token_id?: string;
    quantity: number;
    alias: string;
  };
}

export type CampaignCondition = CampaignConditionAccounts | CampaignConditionOwnsToken;

export interface CreateCampaignDTO {
  campaignName: string;
  evaluateConditions: string;
  conditions: CampaignCondition[];
}
