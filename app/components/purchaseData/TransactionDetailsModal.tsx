import React from "react";
import {
  BlockStack,
  Card,
  Divider,
  InlineStack,
  Modal,
  Text,
  Button,
} from "@shopify/polaris";
import { StatusBadge } from "./StatusBadge";
import { ClipboardIcon, } from '@shopify/polaris-icons';
import { PurchaseDataLineItemDto } from "~/models/dtos/purchaseData/purchaseDataLineItems.dto";


export interface TransactionDetailsModalProps {
  open: boolean;
  selectedPurchase: {
    shopify_order_id: string;
    user_did: string;
    total_amount: number;
    order_status: string;
    order_date: string;
    campaign: { type: string };
    line_items: PurchaseDataLineItemDto[];
  } | null;
  onClose: () => void;
  copyToClipboard: () => void;
}

export const TransactionDetailsModal = ({
  open,
  selectedPurchase,
  onClose,
  copyToClipboard,
}: TransactionDetailsModalProps ) => {
  return (
    <Modal open={open} onClose={onClose} title="Transaction Details">
      <Modal.Section>
        {selectedPurchase && (
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Order Information
              </Text>
              <Divider />
              <BlockStack gap="200">
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Purchase ID:
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    {selectedPurchase.shopify_order_id}
                  </Text>
                </InlineStack>
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Customer (DID):
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {selectedPurchase.user_did}
                  </Text>
                </InlineStack>
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Order Amount:
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {selectedPurchase.total_amount}
                  </Text>
                </InlineStack>
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Status:
                  </Text>
                  <StatusBadge status={selectedPurchase.order_status} />
                </InlineStack>
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Date:
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {selectedPurchase.order_date}
                  </Text>
                </InlineStack>
                <InlineStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Type:
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {selectedPurchase.campaign.type === "TOKEN_REDEMPTION"
                      ? "Token Redemption"
                      : "Purchase"}
                  </Text>
                </InlineStack>
              </BlockStack>
              <Divider />
              <Text variant="headingMd" as="h2">
                Line Items
              </Text>
              <BlockStack gap="200">
                {selectedPurchase.line_items.map((item, index) => (
                  <InlineStack key={index} gap="200">
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      {item.product_name}
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Quantity: {item.quantity}
                    </Text>
                    {item.used_contract && (
                      <Text as="p" variant="bodyMd">
                        Contract: {item.used_contract}
                      </Text>
                    )}
                    {item.used_token_id && (
                      <Text as="p" variant="bodyMd">
                        Token: {item.used_token_id}
                      </Text>
                    )}
                  </InlineStack>
                ))}
              </BlockStack>
            </BlockStack>
            <BlockStack align="end" gap="200">
              <div style={{ marginTop: "20px" }}>
                <InlineStack align="end">
                  <Button onClick={copyToClipboard} icon={ClipboardIcon}>
                    Copy to clipboard
                  </Button>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        )}
      </Modal.Section>
    </Modal>
  );
};
