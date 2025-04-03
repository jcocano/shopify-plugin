import { ConditionTypeEnum, OperatorEnum } from "@prisma/client";
import { CampaignConditionDto } from "app/models/dtos/campaigns/CampaignConditions.dto";
import { generateRuleName } from "app/utils/campaign/generateRuleName";

export const createConditionHandlers = (
  ruleState: {
    selectedIndex: number | null;
    ruleName: string;
    conditionType: ConditionTypeEnum;
    operator: OperatorEnum;
    blockchain: string;
    contractAddress: string;
    tokenQty: string;
    tokenIds: string;
    walletAddresses: string;
  },
  setRuleState: React.Dispatch<React.SetStateAction<typeof ruleState>>,
  conditions: CampaignConditionDto[],
  updateCampaignData: (key: "conditions", value: CampaignConditionDto[]) => void
) => {
  
  const resetConditionForm = () => {
    setRuleState({
      selectedIndex: null,
      ruleName: "",
      conditionType: ConditionTypeEnum.OWNS_TOKEN,
      operator: OperatorEnum.INCLUDES,
      blockchain: "",
      contractAddress: "",
      tokenQty: "",
      tokenIds: "",
      walletAddresses: "",
    });
  };

  const openConditionEditor = (conditionIndex: number) => {
    const condition = conditions[conditionIndex];

    setRuleState({
      selectedIndex: conditionIndex,
      ruleName: condition.ruleName || "",
      conditionType: condition.type,
      operator: condition.operator || OperatorEnum.INCLUDES,
      blockchain: condition.blockchain || "",
      contractAddress: condition.contract || "",
      tokenQty: condition.tokenQty?.toString() || "",
      tokenIds: condition.tokenIds?.join(", ") || "",
      walletAddresses: condition.wallet?.join(", ") || "",
    });
  };

  const addCondition = () => {
    const newCondition: CampaignConditionDto = {
      ruleName: ruleState.ruleName || generateRuleName(conditions.map(c => c.ruleName)),
      type: ruleState.conditionType,
      operator: ruleState.operator,
      blockchain: ruleState.blockchain || undefined,
      tokenIds: ruleState.tokenIds ? ruleState.tokenIds.split(",").map(id => id.trim()) : [],
      wallet: ruleState.walletAddresses ? ruleState.walletAddresses.split(",").map(addr => addr.trim()) : [],
      contract: ruleState.contractAddress || undefined,
      tokenQty: ruleState.tokenQty ? parseInt(ruleState.tokenQty, 10) : undefined,
    };

    const updatedConditions = ruleState.selectedIndex !== null
      ? conditions.map((c, index) => (index === ruleState.selectedIndex ? newCondition : c))
      : [...conditions, newCondition];

    updateCampaignData("conditions", updatedConditions);
    resetConditionForm();
  };

  const deleteCondition = () => {
    if (ruleState.selectedIndex !== null) {
      const updatedConditions = conditions.filter((_, index) => index !== ruleState.selectedIndex);
      updateCampaignData("conditions", updatedConditions);
    }
    resetConditionForm();
  };

  return { openConditionEditor, resetConditionForm, addCondition, deleteCondition };
};
