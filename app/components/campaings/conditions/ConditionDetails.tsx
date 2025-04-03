import { 
  ConditionTypeEnum, 
  EvaluatedConditionEnum, 
  OperatorEnum 
} from "@prisma/client";

import { 
  BlockStack, 
  Box, 
  Button, 
  Card, 
  InlineGrid, 
  InlineStack, 
  Select, 
  Text 
} from "@shopify/polaris";

import { 
  DeleteIcon, 
  EditIcon, 
  PlusIcon 
} from "@shopify/polaris-icons";

import { useState } from "react";

import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { elegibilityConditionsOptions } from "app/utils/constants/campaign";

import { ConditionsModal } from "./ConditionsModal";

interface ConditionDetailsProps {
  campaignData: CampaignDto;
  updateCampaignData: <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => void;
}

export const ConditionDetails: React.FC<ConditionDetailsProps> = ({ campaignData, updateCampaignData }) => {
  const [selectedCondition, setSelectedCondition] = useState<number | undefined>();

  const openEditor = (index?: number) => {
    setSelectedCondition(undefined);
    setTimeout(() => setSelectedCondition(index ?? undefined), 0);
    shopify.modal.show("condition-editor");
  };

  const deleteCondition = (index: number) => {
    const newConditions = campaignData.conditions.filter((_, i) => i !== index);
    updateCampaignData("conditions", newConditions);
  };

  return (
    <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
      <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
        <Text as="h3" variant="headingMd">
          Eligibility Conditions
        </Text>
        <Text as="p" variant="bodyMd">
          Please provide the eligibility conditions
        </Text>
      </Box>
      <Card roundedAbove="sm">
        <BlockStack gap="400">
          <InlineGrid columns="1fr auto">
            <InlineStack align="end">
              <ConditionsModal
                conditions={campaignData.conditions}
                updateCampaignData={updateCampaignData}
                selectedConditionIndex={selectedCondition}
                setSelectedCondition={setSelectedCondition}
              />
            </InlineStack>
          </InlineGrid>
          <InlineStack gap="200" wrap={false} blockAlign="center">
            <Select
              label={undefined}
              options={elegibilityConditionsOptions}
              value={campaignData.evaluated_condition}
              onChange={(e) => updateCampaignData("evaluated_condition", e as EvaluatedConditionEnum)}
            />
            <Text as="h2" variant="headingSm">
              Shoppers who meet the following conditions are eligible for this campaign:
            </Text>
          </InlineStack>
          {campaignData?.conditions?.length ? (
            campaignData.conditions.map((condition, i) => {
              let conditionText = `${condition.ruleName} - `;

              if (condition.type === ConditionTypeEnum.OWNS_TOKEN) {
                conditionText += "Blockchain Contract Condition";
              } else if (condition.type === ConditionTypeEnum.WALLET_LIST) {
                if (condition.operator === OperatorEnum.INCLUDES) {
                  conditionText += "Includes Wallet List";
                } else if (condition.operator === OperatorEnum.EXCLUDES) {
                  conditionText += "Excludes Wallet List";
                }
              }

              return (
                <InlineStack key={i} align="space-between" blockAlign="center">
                  <Text as="p" variant="bodyMd" tone="subdued" truncate>
                    {conditionText}
                  </Text>
                  <InlineStack gap="200">
                    <Button
                      icon={EditIcon}
                      accessibilityLabel="Edit condition"
                      variant="secondary"
                      onClick={() => openEditor(i)}
                    />
                    <Button
                      icon={DeleteIcon}
                      tone="critical"
                      accessibilityLabel="Delete campaign"
                      onClick={() => deleteCondition(i)}
                    />
                  </InlineStack>
                </InlineStack>
              );
            })
          ) : (
            <InlineStack align="space-between" blockAlign="center">
              <Text as="p" variant="bodyMd" tone="subdued">
                Add tokengating condition for your campaign!
              </Text>
              <Button
                tone="success"
                icon={PlusIcon}
                accessibilityLabel="Add new Condition"
                onClick={() => openEditor(undefined)}
              >
                Add new condition
              </Button>
            </InlineStack>
          )}
        </BlockStack>
      </Card>
    </InlineGrid>
  );
};
