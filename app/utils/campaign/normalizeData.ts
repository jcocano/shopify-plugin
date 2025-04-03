import { CampaignConditionDto } from "app/models/dtos/campaigns/CampaignConditions.dto";

export const normalizeSelectedProducts = (products?: any[]) => {
  return products?.map((product) => ({
    product_id: product.id,
    title: product.title,
    image_url: product.image_url ?? undefined,
    variantId: product.variantId ?? undefined,
    variantTitle: product.variantTitle ?? undefined,
  })) || [];
};

export const normalizeConditions = (conditions?: any[]): CampaignConditionDto[] => {
  return conditions?.map(({ rule_name, tokenIds, ...condition }) => ({
    ...condition,
    ruleName: rule_name,
    tokenIds: Array.isArray(tokenIds) ? tokenIds : [],
    wallet: Array.isArray(condition.wallet) ? condition.wallet : [],
  })) || [];
};
