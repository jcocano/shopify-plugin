import { useEffect, useState } from "react";
import { Modal, useAppBridge } from "@shopify/app-bridge-react";
import { Button, InlineGrid, InlineStack, Text, } from "@shopify/polaris";
import { AttachmentIcon, PlusCircleIcon, } from "@shopify/polaris-icons";
import { ConditionTypeEnum, OperatorEnum } from "@prisma/client";
import { CampaignDto } from "app/models/dtos/campaigns/Campaign.dto";
import { CampaignConditionDto } from "app/models/dtos/campaigns/CampaignConditions.dto";
import { ConditionForm } from "./ConditionForm";
import { ConditionSelector } from "./ConditionSelector";
import { createConditionHandlers } from "app/hooks/useConditionHandlers";

interface RuleState {
  selectedIndex: number | null;
  ruleName: string;
  conditionType: ConditionTypeEnum;
  operator: OperatorEnum;
  blockchain: string,
  contractAddress: string;
  tokenQty: string;
  tokenIds: string;
  walletAddresses: string;
}

export function ConditionsModal({
  conditions,
  selectedConditionIndex,
  setSelectedCondition,
  updateCampaignData
}: {
  conditions: CampaignConditionDto[];
  selectedConditionIndex? : number;
  setSelectedCondition: React.Dispatch<React.SetStateAction<number | undefined>>
  updateCampaignData: <K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) => void;
}) {
  const shopify = useAppBridge();
  
  const [ruleState, setRuleState] = useState<RuleState>({
    selectedIndex: null as number | null,
    ruleName: "",
    conditionType: ConditionTypeEnum.OWNS_TOKEN,
    operator: OperatorEnum.INCLUDES,
    blockchain: "",
    contractAddress: "",
    tokenQty: "",
    tokenIds: "",
    walletAddresses: "",
  });

  const updateRuleState = <K extends keyof typeof ruleState>(key: K, value: typeof ruleState[K]) => {
    setRuleState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { openConditionEditor, resetConditionForm, addCondition, deleteCondition } = createConditionHandlers(
    ruleState,
    setRuleState,
    conditions,
    updateCampaignData
  );

  const newCondition = () => {
    setSelectedCondition(undefined)
    shopify.modal.show("condition-editor")
  }

  useEffect(() => {
    if (selectedConditionIndex !== undefined && conditions[selectedConditionIndex]) {
      openConditionEditor(selectedConditionIndex);
    } else {
      resetConditionForm();
    }
  }, [selectedConditionIndex]);

  return (
    <>
      <Button 
        variant="plain" 
        onClick={() => newCondition()} 
        accessibilityLabel="Add New Condition" 
        icon={PlusCircleIcon}
      >
        Add New Condition
      </Button>
      <Modal id="condition-editor" variant="large">
        <div style={{ padding: "10px 30px" }}>
          <InlineStack align="space-between" wrap={false}>
            <Text variant="bodyMd" as="p">
              Let's pick an eligibility condition to add to this campaign! 😊
            </Text>
            <Button 
              icon={AttachmentIcon} 
              variant="plain" 
              onClick={resetConditionForm}
            >
              New Condition
            </Button>
          </InlineStack>
          <div style={{ padding: "10px 0", margin: "1rem" }}>
            <InlineGrid gap="400" columns={"1.5fr 5.5fr"}>
              <ConditionSelector 
                conditions={conditions} 
                conditionType={ruleState.conditionType} 
                setConditionType={(value) => updateRuleState("conditionType", value)}
                openConditionEditor={openConditionEditor}
              />
              <div
                style={{
                  border: "2px solid #D1D5DB",
                  borderRadius: "16px",
                  padding: "16px",
                  backgroundColor: "#F3F4F6",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.10)",
                }}
              >
                <ConditionForm 
                ruleState={ruleState}
                updateRuleState={updateRuleState}
                onAddRule={addCondition}
                onDeleteRule={deleteCondition}
                />
              </div>
            </InlineGrid>
          </div>
        </div>
      </Modal>
    </>
  );
}
