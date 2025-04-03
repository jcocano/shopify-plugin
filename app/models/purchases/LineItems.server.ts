// app/models/lineItems.server.ts
import db from "../../db.server";
import { PurchaseDataLineItemDto } from "../dtos/purchaseData/PurchaseDataLineItems.dto";

export async function createLineItems(
  purchaseDataId: string,
  lineItems: PurchaseDataLineItemDto[]
) {
  return await Promise.all(
    lineItems.map((item) =>
      db.lineItem.create({
        data: {
          purchase_data_id: purchaseDataId,
          product_name: item.product_name,
          quantity: item.quantity,
          used_contract: item.used_contract,
          used_token_id:
            item.used_token_id !== undefined ? item.used_token_id.toString() : null,
        },
      })
    )
  );
}

export async function updateLineItem(
  lineItemId: number,
  data: Partial<PurchaseDataLineItemDto>
) {
  return await db.lineItem.update({
    where: { id: lineItemId },
    data: {
      product_name: data.product_name,
      quantity: data.quantity,
      used_contract: data.used_contract,
      used_token_id:
        data.used_token_id !== undefined ? data.used_token_id.toString() : undefined,
    },
  });
}

export async function deleteLineItemsByPurchaseDataId(purchaseDataId: string) {
  return await db.lineItem.deleteMany({
    where: { purchase_data_id: purchaseDataId },
  });
}
