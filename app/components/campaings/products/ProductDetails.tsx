import { ProductSelectionEnum } from "@prisma/client";

import { 
  BlockStack, 
  Box, 
  Card, 
  ChoiceList, 
  InlineGrid, 
  InlineStack, 
  Text 
} from "@shopify/polaris";

import { motion } from "framer-motion";

import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { campaignProductOptions } from "app/utils/constants/campaign";

import { CampaignSelectedProductList } from "./CampaignSelectedProductList";
import { ProductPicker } from "./ProductPickerModal";

interface ProductDetailsProps {
  campaignData: CampaignDto;
  updateCampaignData: <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ campaignData, updateCampaignData }) => {
  return (
    <InlineGrid
      columns={{
        xs: "1fr",
        md: campaignData.product_selection_type === ProductSelectionEnum.SELECTED_PRODUCT
          ? "2fr 2fr 3fr"
          : "2fr 5fr",
      }}
      gap="400"
    >
      <Box
        as="section"
        paddingInlineStart={{ xs: "400", sm: "0" }}
        paddingInlineEnd={{ xs: "400", sm: "0" }}
      >
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Product Selection
          </Text>
          <Text as="p" variant="bodyMd">
            Select products to interact with the campaign
          </Text>
        </BlockStack>
      </Box>
      <Card roundedAbove="sm">
        <div style={{ display: "flex", flexDirection: "column", minHeight: "180px" }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="200">
              <ChoiceList
                title="Choose products for the campaign"
                choices={campaignProductOptions}
                selected={[campaignData.product_selection_type]}
                onChange={(e) => {
                  const newSelectionType = e[0] as ProductSelectionEnum;
                  updateCampaignData("product_selection_type", newSelectionType);

                  if (newSelectionType === ProductSelectionEnum.ALL_PRODUCTS) {
                    updateCampaignData("selected_products", []);
                  }
                }}
              />
            </BlockStack>
          </div>
          {campaignData.product_selection_type === ProductSelectionEnum.SELECTED_PRODUCT && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div style={{ paddingTop: "15px", }}>
                <InlineStack align="end">
                  <ProductPicker
                    selectedProducts={campaignData.selected_products}
                    onProductsSelected={(newProducts) => {
                      updateCampaignData("selected_products", newProducts);
                    }}
                  />
                </InlineStack>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
      {campaignData.product_selection_type === ProductSelectionEnum.SELECTED_PRODUCT && (
        <CampaignSelectedProductList
          items={campaignData.selected_products}
          updateCampaignData={updateCampaignData}
        />
      )}
    </InlineGrid>
  );
};
