import type { OrderStatusEnum } from "@prisma/client";
import type { PurchaseDataLineItemDto } from "./purchaseDataLineItems.dto";

export interface PurchaseDataDto {
  shop: string;
  shopify_order_id: string;
  order_date: string;
  order_status: OrderStatusEnum;
  total_amount: number;
  campaign_id: string;
  user_session_id: string;
  user_session_nonce: string;
  user_did: string;
  user_wallet_address: string;
  line_items: PurchaseDataLineItemDto[];
}

export function createPurchaseDataDto(data?: Partial<PurchaseDataDto>): PurchaseDataDto {
  return {
    shop: data?.shop || "",
    shopify_order_id: data?.shopify_order_id || "",
    order_date: data?.order_date || new Date().toISOString(),
    order_status: data?.order_status || "PENDING" as OrderStatusEnum,
    total_amount: data?.total_amount ?? 0,
    campaign_id: data?.campaign_id || "",
    user_session_id: data?.user_session_id || "",
    user_session_nonce: data?.user_session_nonce || "",
    user_did: data?.user_did || "",
    user_wallet_address: data?.user_wallet_address || "",
    line_items: data?.line_items || [],
  };
}
