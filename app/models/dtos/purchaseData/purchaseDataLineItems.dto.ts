export interface PurchaseDataLineItemDto {
  product_name: string;
  quantity: number;
  used_contract?: string;
  used_token_id?: string;
}

export function createPurchaseDataLineItemDto(
  data?: Partial<PurchaseDataLineItemDto>
): PurchaseDataLineItemDto {
  return {
    product_name: data?.product_name || "",
    quantity: data?.quantity ?? 0,
    used_contract: data?.used_contract,
    used_token_id: data?.used_token_id,
  };
}
