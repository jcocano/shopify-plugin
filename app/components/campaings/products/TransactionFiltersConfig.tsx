import { ChoiceList, TextField, RangeSlider } from '@shopify/polaris';
import { isEmpty } from 'app/utils/misc/empty';
import { disambiguateLabel } from 'app/utils/purchaseData/accountLabels';

export interface TransactionFilter {
  key: string;
  label: string;
  filter: React.ReactNode;
  shortcut?: boolean;
}

export interface AppliedFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface TransactionFiltersConfig {
  filters: TransactionFilter[];
  appliedFilters: AppliedFilter[];
}

export interface TransactionFiltersConfigParams {
  accountStatus: string[];
  transactionType: string[];
  taggedWith: string;
  moneySpent: [number, number] | undefined;
  handleAccountStatusChange: (value: string[]) => void;
  handleTransactionTypeChange: (value: string[]) => void;
  handleTaggedWithChange: (value: string) => void;
  handleMoneySpentChange: (value: [number, number]) => void;
  handleAccountStatusRemove: () => void;
  handleTransactionTypeRemove: () => void;
  handleTaggedWithRemove: () => void;
  handleMoneySpentRemove: () => void;
}

export function getTransactionFiltersConfig(
  params: TransactionFiltersConfigParams
): TransactionFiltersConfig {
  const {
    accountStatus,
    transactionType,
    taggedWith,
    moneySpent,
    handleAccountStatusChange,
    handleTransactionTypeChange,
    handleTaggedWithChange,
    handleMoneySpentChange,
    handleAccountStatusRemove,
    handleTransactionTypeRemove,
    handleTaggedWithRemove,
    handleMoneySpentRemove,
  } = params;

  const filters: TransactionFilter[] = [
    {
      key: 'accountStatus',
      label: 'Account status',
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: 'Paid', value: 'PAID' },
            { label: 'Redeemed', value: 'REDEEMED' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Canceled', value: 'CANCELED' },
            { label: 'Fulfilled', value: 'FULFILLED' },
          ]}
          selected={accountStatus}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'transactionType',
      label: 'Transaction type',
      filter: (
        <ChoiceList
          title="Transaction type"
          titleHidden
          choices={[
            { label: 'Purchase', value: 'purchases' },
            { label: 'Token Redemption', value: 'tokenRedemptions' },
          ]}
          selected={transactionType}
          onChange={handleTransactionTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: 'moneySpent',
      label: 'Money spent',
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent ? moneySpent : [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters: AppliedFilter[] = [];

  if (!isEmpty(accountStatus)) {
    appliedFilters.push({
      key: 'accountStatus',
      label: disambiguateLabel('accountStatus', accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (!isEmpty(transactionType)) {
    appliedFilters.push({
      key: 'transactionType',
      label: disambiguateLabel('transactionType', transactionType),
      onRemove: handleTransactionTypeRemove,
    });
  }
  if (moneySpent) {
    appliedFilters.push({
      key: 'moneySpent',
      label: disambiguateLabel('moneySpent', moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    appliedFilters.push({
      key: 'taggedWith',
      label: disambiguateLabel('taggedWith', taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  return { filters, appliedFilters };
}
