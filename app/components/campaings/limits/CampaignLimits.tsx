
import { 
  BlockStack, 
  Box, 
  Card, 
  InlineGrid, 
  Select, 
  Text, 
  TextField 
} from "@shopify/polaris";

import { useState } from "react";

import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { campaignProductLimitOptions } from "app/utils/constants/campaign";

interface CampaignLimitsProps {
  campaignData: CampaignDto;
  updateCampaignData: <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => void;
}

export const CampaignLimits: React.FC<CampaignLimitsProps> = ({ campaignData, updateCampaignData }) => {
  const [productLimits, setProductLimits] = useState<boolean>(
    () => (campaignData.product_purchase_limit ?? 0) >= 1
  );

  const handleSelectChange = (value: string) => {
    const hasLimit = value === 'true'
    setProductLimits(hasLimit);
    if (!hasLimit) updateCampaignData("product_purchase_limit", 0);
  };

  return (
    <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
      <Box
        as="section"
        paddingInlineStart={{ xs: "400", sm: "0" }}
        paddingInlineEnd={{ xs: "400", sm: "0" }}
      >
        <Text as="h3" variant="headingMd">
          Campaign Limits
        </Text>
        <Text as="p" variant="bodyMd">
          Please provide product purchase limits
        </Text>
      </Box>
      <Card roundedAbove="sm">
        <BlockStack gap="400">
          <Select
            label="Should we restrict all products associated with this campaign?"
            options={campaignProductLimitOptions}
            onChange={handleSelectChange}
            value={productLimits ? "true" : "false"}
          />
          {productLimits && (
            <TextField 
              autoComplete="off"
              type="number"
              min="1"
              label="Please specify the limit for each product" 
              value={campaignData.product_purchase_limit?.toString()}
              onChange={(value) => updateCampaignData("product_purchase_limit", parseInt(value, 10))}
            />
          )}
        </BlockStack>
      </Card>
    </InlineGrid>
  );
};
