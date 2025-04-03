import { IndexFilters } from '@shopify/polaris';
import type { IndexFiltersMode, SortButtonChoice } from '@shopify/polaris';

interface TransactionFiltersProps {
  sortOptions: SortButtonChoice[];
  sortSelected: string[];
  onSort: (selected: string[]) => void;
  tabs: { content: string; index: number; onAction: () => void; id: string; isLocked: boolean }[];
  selected: number;
  onSelect: (selected: number) => void;
  filters: any[];
  appliedFilters: any[];
  queryValue: string;
  onQueryChange: (value: string) => void;
  onQueryClear: () => void;
  onClearAll: () => void;
  mode: IndexFiltersMode;
  setMode: (mode: IndexFiltersMode) => void;
}

export const TransactionFilters = ({
  sortOptions,
  sortSelected,
  onSort,
  tabs,
  selected,
  onSelect,
  filters,
  appliedFilters,
  queryValue,
  onQueryChange,
  onQueryClear,
  onClearAll,
  mode,
  setMode,
}: TransactionFiltersProps) => {
  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={queryValue}
      queryPlaceholder="Search transactions"
      onQueryChange={onQueryChange}
      onQueryClear={onQueryClear}
      onSort={onSort}
      tabs={tabs}
      selected={selected}
      onSelect={onSelect}
      filters={filters}
      appliedFilters={appliedFilters}
      onClearAll={onClearAll}
      mode={mode}
      setMode={setMode}
    />
  );
}
