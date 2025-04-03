export interface CampaignSelectedProductsDto {
  id?: number;
  product_id: string;
  title: string;
  image_url?: string;
  variantId?: string;
  variantTitle?: string;
}

export function createDefaultCampaignSelectedProductsDto(
  data?: Partial<CampaignSelectedProductsDto>
): CampaignSelectedProductsDto {
  return {
    id: data?.id,
    product_id: data?.product_id || "",
    title: data?.title || "",
    image_url: data?.image_url,
    variantId: data?.variantId,
    variantTitle: data?.variantTitle,
  };
}
