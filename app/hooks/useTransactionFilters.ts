import { useCallback, useState } from 'react';

export function useTransactionFilters() {
  const [queryValue, setQueryValue] = useState("");
  const [accountStatus, setAccountStatus] = useState<string[]>([]);
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const [transactionType, setTransactionType] = useState<string[]>([]);

  const handleAccountStatusChange = useCallback((value: string[]) => setAccountStatus(value), []);
  const handleMoneySpentChange = useCallback((value: [number, number]) => setMoneySpent(value), []);
  const handleTaggedWithChange = useCallback((value: string) => setTaggedWith(value), []);
  const handleTransactionTypeChange = useCallback((value: string[]) => setTransactionType(value), []);
  const handleFiltersQueryChange = useCallback((value: string) => setQueryValue(value), []);

  const handleAccountStatusRemove = useCallback(() => setAccountStatus([]), []);
  const handleMoneySpentRemove = useCallback(() => setMoneySpent(undefined), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleTransactionTypeRemove = useCallback(() => setTransactionType([]), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleTransactionTypeRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleTaggedWithRemove,
    handleTransactionTypeRemove,
    handleQueryValueRemove,
  ]);

  return {
    queryValue,
    accountStatus,
    moneySpent,
    taggedWith,
    transactionType,
    handleAccountStatusChange,
    handleMoneySpentChange,
    handleTaggedWithChange,
    handleTransactionTypeChange,
    handleFiltersQueryChange,
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleTaggedWithRemove,
    handleTransactionTypeRemove,
    handleQueryValueRemove,
    handleFiltersClearAll,
  };
}
