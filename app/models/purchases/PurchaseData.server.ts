import db from "../../db.server";
import { randomUUID } from "crypto";
import { PurchaseDataDto } from "../dtos/purchaseData/purchaseData.dto";
import { createLineItems } from "./LineItems.server";

export async function createPurchaseData(data: PurchaseDataDto) {
  const purchaseId = (data as any).id || randomUUID();

  const walletAddress = data.user_wallet_address;

  const purchase = await db.purchaseData.create({
    data: {
      id: purchaseId,
      shop: data.shop,
      shopify_order_id: data.shopify_order_id,
      order_date: new Date(data.order_date),
      order_status: data.order_status,
      total_amount: data.total_amount,
      campaign: { connect: { id: data.campaign_id } },
      user_session_id: data.user_session_id,
      user_session_nonce: data.user_session_nonce,
      user_did: data.user_did,
      user_wallet: { connect: { wallet_address: walletAddress } }
    },
    select: {
      id: true,
      shop: true,
      shopify_order_id: true,
    },
  });

  if (data.line_items && data.line_items.length) {
    await createLineItems(purchase.id, data.line_items);
  }

  return purchase;
}

export async function getPurchaseDatas(shop: string, size = 25, offset = 0) {
  const totalRecords = await db.purchaseData.count({ where: { shop } });

  const result = await db.purchaseData.findMany({
    where: { shop },
    skip: offset,
    take: size,
    include: {
      line_items: true,
      campaign: true,
      user_wallet: true,
    },
  });

  return { result, filterRecords: result.length, totalRecords };
}

export async function getPurchaseData(shop: string, id: string) {
  return await db.purchaseData.findFirst({
    where: { id, shop },
    include: {
      line_items: true,
      campaign: true,
      user_wallet: true,
    },
  });
}

export async function updatePurchaseData(
  shop: string,
  id: string,
  data: Partial<PurchaseDataDto>
) {
  const walletAddress = data.user_wallet_address;

  const purchase = await db.purchaseData.update({
    where: { id, shop },
    data: {
      shop: data.shop,
      shopify_order_id: data.shopify_order_id,
      order_date: data.order_date ? new Date(data.order_date) : undefined,
      order_status: data.order_status,
      total_amount: data.total_amount,
      campaign: data.campaign_id ? { connect: { id: data.campaign_id } } : undefined,
      user_session_id: data.user_session_id,
      user_session_nonce: data.user_session_nonce,
      user_did: data.user_did,
      user_wallet: { connect: { wallet_address: walletAddress } }
    },
    include: { line_items: true },
  });

  return purchase;
}

export async function deletePurchaseData(shop: string, id: string) {
  await db.lineItem.deleteMany({
    where: { purchase_data_id: id },
  });
  return await db.purchaseData.delete({
    where: { id, shop },
  });
}
