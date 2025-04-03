import type {
  CampaignEnum,
  DiscountEnum,
  EvaluatedConditionEnum,
  ProductSelectionEnum,
  StatusEnum
} from '@prisma/client';
import type { CampaignConditionDto } from "./CampaignConditions.dto";
import type { CampaignSelectedProductsDto } from "./CampaignSelectedProducts.dto";

export interface CampaignDto {
  id?: string;
  shop: string;
  title: string;
  auth_policy: string;
  type: CampaignEnum;
  discount_type: DiscountEnum;
  discount: number;
  offer_description?: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  status: StatusEnum;
  is_auto_archive: boolean;
  product_selection_type: ProductSelectionEnum;
  selected_products: CampaignSelectedProductsDto[];
  evaluated_condition: EvaluatedConditionEnum;
  conditions: CampaignConditionDto[];
  product_purchase_limit?: number;
}

export function createDefaultCampaignDto(
  data?: Partial<CampaignDto>
): CampaignDto {
  return {
    shop: data?.shop || "",
    title: data?.title || "",
    auth_policy: data?.auth_policy || "",
    type: data?.type || "SPECIAL_DISCOUNT" as CampaignEnum,
    discount_type: data?.discount_type || "PERCENTAGE" as DiscountEnum,
    discount: data?.discount ?? 0,
    offer_description: data?.offer_description,
    is_active: data?.is_active ?? false,
    start_date: data?.start_date || new Date().toISOString(),
    end_date: data?.end_date || new Date('2999-12-31T23:59:59Z').toISOString(),
    status: data?.status || "DRAFT" as StatusEnum,
    is_auto_archive: data?.is_auto_archive ?? false,
    product_selection_type: data?.product_selection_type || "ALL_PRODUCTS" as ProductSelectionEnum,
    selected_products: data?.selected_products || [],
    evaluated_condition: data?.evaluated_condition || "ALL" as EvaluatedConditionEnum,
    conditions: data?.conditions || [],
    product_purchase_limit: data?.product_purchase_limit,
    id: data?.id,
  };
}
