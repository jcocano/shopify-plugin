import { randomUUID } from "crypto";
import { CampaignDto } from "../dtos/campaigns/Campaign.dto";
import db from "../../db.server";
import { upsertSelectedProduct } from "./CampaignSelectedProducts.server";
import { upsertCondition } from "./CampaignConditions.server";

export async function createCampaign(data: CampaignDto) {
  const { selected_products, conditions, id, shop, ...campaignData } = data;

  const campaignId = id || randomUUID();

  const campaign = await db.campaign.create({
    data: {
      id: campaignId,
      shop: shop,
      ...campaignData,
    },
    select: {
      id: true,
      auth_policy: true,
    },
  });

  if (selected_products?.length) {
    await Promise.all(
      selected_products.map((product) =>
        upsertSelectedProduct(campaign.id, product)
      )
    );
  }

  if (conditions?.length) {
    await Promise.all(
      conditions.map((condition) =>
        upsertCondition(condition, campaign.id)
      )
    );
  }

  return campaign;
}

export async function getCampaigns(shop: string, size = 25, offset = 0) {
  const totalRecords = await db.campaign.count({ where: { shop } });

  const result = await db.campaign.findMany({
    where: { shop },
    skip: offset,
    take: size,
    include: {
      selected_products: true,
      conditions: true,
    },
  });

  return { result, filterRecords: result.length, totalRecords };
}

export async function getCampaign(shop: string, id: string) {
  return await db.campaign.findUnique({
    where: { id, shop },
    include: {
      selected_products: true,
      conditions: true,
    },
  });
}

export async function getCampaignByProduct(
  shop: string,
  productId: string,
  variantId?: string
){
  return await db.campaign.findMany({
    where: {
      shop,
      selected_products: {
        some: {
          product_id: productId,
          ...(variantId ? { variantId } : {}),
        },
      },
    },
    include: {
      selected_products: true,
      conditions: true,
    },
  });
}

export async function updateCampaign(shop: string, id: string, data: Partial<CampaignDto>) {
  const { selected_products = [], conditions = [], ...campaignData } = data;

  console.log("🚀 Updating campaign:", JSON.stringify(data, null, 2));

  const campaign = await db.campaign.update({
    where: { id, shop },
    data: {
      ...campaignData,
    },
  });

  const existingProducts = await db.campaignSelectedProduct.findMany({
    where: { campaignId: id },
    select: { product_id: true },
  });

  const existingProductIds = new Set(existingProducts.map(p => p.product_id));
  const newProductIds = new Set(selected_products.map(p => String(p.product_id)));

  const productsToDelete = [...existingProductIds].filter(id => !newProductIds.has(id));
  
  if (productsToDelete.length) {
    console.log("🗑 Removing products:", productsToDelete);
    await db.campaignSelectedProduct.deleteMany({
      where: {
        campaignId: id,
        product_id: { in: productsToDelete },
      },
    });
  }

  if (selected_products.length > 0) {
    await Promise.all(
      selected_products.map((product) =>
        upsertSelectedProduct(id, product)
      )
    );
  }

  const existingConditions = await db.campaignCondition.findMany({
    where: { campaignId: id },
    select: { id: true },
  });

  const existingConditionIds = new Set(existingConditions.map(c => c.id));
  const newConditionIds = new Set(conditions.map(c => c.id));

  const conditionsToDelete = [...existingConditionIds].filter(id => !newConditionIds.has(id));

  if (conditionsToDelete.length) {
    console.log("🗑 Removing conditions:", conditionsToDelete);
    await db.campaignCondition.deleteMany({
      where: {
        campaignId: id,
        id: { in: conditionsToDelete },
      },
    });
  }

  if (conditions.length > 0) {
    await Promise.all(
      conditions.map((condition) => upsertCondition(condition, id))
    );
  }

  return campaign;
}

export async function deleteCampaign(shop: string, id: string) {
  await db.campaignCondition.deleteMany({ where: { campaignId: id } });
  await db.campaignSelectedProduct.deleteMany({ where: { campaignId: id } });

  return await db.campaign.delete({ where: { id, shop } });
}
