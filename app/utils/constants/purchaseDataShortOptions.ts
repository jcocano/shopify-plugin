import type { SortButtonChoice } from '@shopify/polaris';

export const purchaseDataShortOptions: SortButtonChoice[] = [
  { label: 'Date', value: 'date asc' as `${string} asc`, directionLabel: 'Newest first' },
  { label: 'Date', value: 'date desc' as `${string} desc`, directionLabel: 'Oldest first' },
  { label: 'Amount', value: 'amount asc' as `${string} asc`, directionLabel: 'Lowest amount first' },
  { label: 'Amount', value: 'amount desc' as `${string} desc`, directionLabel: 'Highest amount first' },
];
