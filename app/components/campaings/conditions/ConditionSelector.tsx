import { ConditionTypeEnum } from "@prisma/client";
import { BlockStack, Button, ChoiceList, Text } from "@shopify/polaris";
import { CampaignConditionDto } from "app/models/dtos/campaigns/CampaignConditions.dto";
import { conditionOptions } from "app/utils/constants/conditions";

interface ConditionSelectorProps { 
  conditions: CampaignConditionDto[];
  conditionType: ConditionTypeEnum; 
  setConditionType: (value: ConditionTypeEnum) => void;
  openConditionEditor: (conditionIndex: number) => void;
}

export const ConditionSelector = ({ 
  conditions, 
  conditionType, 
  setConditionType, 
  openConditionEditor 
}: ConditionSelectorProps ) => (
  <BlockStack gap={"200"}>
    <ChoiceList
      title=""
      choices={conditionOptions}
      allowMultiple={false}
      selected={[conditionType]}
      onChange={(value) => setConditionType(value[0] as ConditionTypeEnum)}
    />
    {conditions.length === 0 ? (
      <Text as="p" variant="bodyMd" tone="subdued">
        Add new condition for your campaign
      </Text>
    ) : (
      <Text as="p" variant="bodyMd" tone="subdued">
        Pick condition for edit...
      </Text>
    )}

    {conditions.map((condition, index) => (
      <Button 
        key={index} 
        variant="plain"
        textAlign="start"
        onClick={() => openConditionEditor(index)}
        accessibilityLabel={`Edit Condition: ${condition.ruleName}`} 
      >
        {condition.ruleName}
      </Button>
    ))}
  </BlockStack>
);
