import { CampaignEnum } from "@prisma/client";

import { 
  BlockStack, 
  Box, 
  Card, 
  ChoiceList, 
  DatePicker, 
  InlineGrid, 
  Select, 
  Text, 
  TextField 
} from "@shopify/polaris";

import { useState } from "react";

import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { getInitialDate, createHandleMonthChange } from "app/utils/campaign/calendar";
import { campaignArchiveOptions, campaignTypeOptions } from "app/utils/constants/campaign";

interface CampaignDetailsProps {
  campaignData: CampaignDto;
  updateCampaignData: <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaignData, updateCampaignData }) => {
  const [{ month, year }, setDate] = useState(getInitialDate(campaignData.start_date));
  const handleMonthChange = createHandleMonthChange(setDate);

  const handleDateChange = (range: { start: Date; end: Date }) => {
    if (range.start) {
      updateCampaignData("start_date", range.start.toISOString());
    }
    if (range.end) {
      updateCampaignData("end_date", range.end.toISOString());
    }
  };

  const handleInputChange = (key: keyof CampaignDto) => (value: string) => {
    updateCampaignData(key, value);
  };

  const handleSelectChange = (key: keyof CampaignDto) => (value: string) => {
    updateCampaignData(key, value as CampaignEnum);
  };

  const handleChoiceListChange = (key: keyof CampaignDto) => (value: string[]) => {
    updateCampaignData(key, value[0] === "true");
  };

  return (
    <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
      <Box
        as="section"
        paddingInlineStart={{ xs: "400", sm: "0" }}
        paddingInlineEnd={{ xs: "400", sm: "0" }}
      >
        <Text as="h3" variant="headingMd">
          Campaign Details
        </Text>
        <Text as="p" variant="bodyMd">
          Please provide the campaign basic details
        </Text>
      </Box>
      <Card roundedAbove="sm">
        <BlockStack gap="400">
          <TextField 
            autoComplete="off" 
            label="Campaign Name" 
            value={campaignData.title}
            onChange={handleInputChange("title")}
          />
          <TextField 
            autoComplete="off" 
            label="Campaign Description" 
            value={campaignData.offer_description}
            onChange={handleInputChange("offer_description")}
          />
          <Select
            label="Campaign Type"
            options={campaignTypeOptions}
            onChange={handleSelectChange("type")}
            value={campaignData.type}
          />
          <DatePicker
            month={month}
            year={year}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            selected={{
              start: new Date(campaignData.start_date),
              end: new Date(campaignData.end_date),
            }}
            multiMonth
            allowRange
            disableDatesBefore={new Date()}
          />
          <ChoiceList
            title="Auto archive products:"
            choices={campaignArchiveOptions}
            selected={[campaignData.is_auto_archive.toString()]}
            onChange={handleChoiceListChange("is_auto_archive")}
          />
        </BlockStack>
      </Card>
    </InlineGrid>
  );
};
