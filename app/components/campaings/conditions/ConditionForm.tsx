import { ConditionTypeEnum, OperatorEnum } from "@prisma/client";
import { Button, FormLayout, TextField, Select, InlineStack, } from "@shopify/polaris";
import { MinusIcon, PlusIcon, SaveIcon } from "@shopify/polaris-icons";
import { blockchains, operators } from "app/utils/constants/conditions";

interface ConditionFormProps {
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
  };
  updateRuleState: <K extends keyof ConditionFormProps["ruleState"]>(
    key: K,
    value: ConditionFormProps["ruleState"][K]
  ) => void;
  onAddRule: () => void;
  onDeleteRule: () => void;
}

export const ConditionForm = ({ 
  ruleState, 
  updateRuleState, 
  onAddRule, 
  onDeleteRule 
}: ConditionFormProps ) => {
  const ownsTokenForm = (
    <FormLayout>
      <TextField 
        label="Rule Name" 
        value={ruleState.ruleName} 
        onChange={(v) => updateRuleState("ruleName", v)} 
        autoComplete="off" />
      <Select 
        label="Blockchain" 
        options={blockchains} 
        onChange={(v) => updateRuleState("blockchain", v)} 
        value={ruleState.blockchain} 
      />
      <TextField 
        label="Smart Contract Address" 
        value={ruleState.contractAddress} 
        onChange={(v) => updateRuleState("contractAddress", v)} 
        autoComplete="off" 
      />
      <TextField 
        type="number" 
        label="Token Quantity" 
        value={ruleState.tokenQty}
        onChange={(v) => updateRuleState("tokenQty", v)} 
        autoComplete="off" 
      />
      <TextField 
        type="text" 
        label="Token ID's (Optional)" 
        placeholder="1, 2, 3, 4" 
        value={ruleState.tokenIds}
        onChange={(v) => updateRuleState("tokenIds", v)} 
        autoComplete="off" 
      />
      <InlineStack gap={"200"} align="end">
        <Button 
          icon={MinusIcon} 
          tone="critical"
          disabled={ruleState.selectedIndex === null}
          onClick={onDeleteRule}
        >
          Delete Rule
        </Button>
        <Button 
          icon={ruleState.selectedIndex !== null ? SaveIcon : PlusIcon} 
          tone="success" 
          onClick={onAddRule}
        >
          {ruleState.selectedIndex !== null ? "Update Rule" : "Add Rule"}
        </Button>
      </InlineStack>
    </FormLayout>
  );

  const walletListForm = (
    <FormLayout>
      <TextField 
        label="Rule Name" 
        value={ruleState.ruleName} 
        onChange={(v) => updateRuleState("ruleName", v)} 
        autoComplete="off" />
      <Select
        label="Operator Selection"
        options={operators}
        onChange={(v) => updateRuleState("operator", v as OperatorEnum)}
        value={ruleState.operator}
      />
      <TextField 
        label="Wallet Addresses (comma-separated)" 
        value={ruleState.walletAddresses}
        onChange={(v) => updateRuleState("walletAddresses", v)} 
        autoComplete="off" 
      />
      <InlineStack gap={"200"} align="end">
        <Button 
          icon={MinusIcon} 
          tone="critical"
          disabled={ruleState.selectedIndex === null}
          onClick={onDeleteRule}
        >
          Delete Rule
        </Button>
        <Button 
          icon={ruleState.selectedIndex !== null ? SaveIcon : PlusIcon} 
          tone="success" 
          onClick={onAddRule}
        >
          {ruleState.selectedIndex !== null ? "Update Rule" : "Add Rule"}
        </Button>
      </InlineStack>
    </FormLayout>
  );

  return ruleState.conditionType === ConditionTypeEnum.OWNS_TOKEN ? ownsTokenForm : walletListForm;
};
