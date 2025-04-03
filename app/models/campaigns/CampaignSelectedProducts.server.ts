import db from "../../db.server";
import { CampaignSelectedProductsDto } from "../dtos/campaigns/CampaignSelectedProducts.dto";

export async function upsertSelectedProduct(campaignId: string, product: CampaignSelectedProductsDto) {
  try {
    return await db.campaignSelectedProduct.upsert({
      where: {
        product_id_campaignId_variantId: {
          product_id: String(product.product_id),
          campaignId: campaignId,
          variantId: product.variantId ?? "",
        },
      },
      update: {
        title: product.title,
        image_url: product.image_url || null,
        variantId: product.variantId || null,
        variantTitle: product.variantTitle || null,
      },
      create: {
        product_id: String(product.product_id),
        campaignId: campaignId,
        title: product.title,
        image_url: product.image_url || null,
        variantId: product.variantId || null,
        variantTitle: product.variantTitle || null,
      },
    })

  } catch (error) {
    console.error("Error upseting selected product:", error)
    throw new Error("Failed to upsert selected product.")
  }
}

export async function deleteSelectedProduct(productId: number) {
  try {
    return await db.campaignSelectedProduct.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error(`Error deleting selected product ${productId}:`, error);
    throw new Error("Failed to delete selected product.");
  }
}

export async function getSelectedProductById(productId: number) {
  try {
    return await db.campaignSelectedProduct.findUnique({
      where: { id: productId },
    });
  } catch (error) {
    console.error(`Error fetching selected product ${productId}:`, error);
    throw new Error("Failed to fetch selected product.");
  }
}

export async function listSelectedProductsByCampaign(campaignId: string) {
  try {
    return await db.campaignSelectedProduct.findMany({
      where: { campaignId },
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error(`Error fetching selected products for campaign ${campaignId}:`, error);
    throw new Error("Failed to fetch selected products.");
  }
}
