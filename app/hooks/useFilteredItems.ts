import { useMemo } from 'react';
import { isEmpty } from 'app/utils/misc/empty';

export interface FilterableItem {
  type: string;
  order_status: string;
  campaign_id: string;
  total_amount: number;
  shopify_order_id: string;
  user_wallet: { wallet_address: string };
}

export interface UseFilteredItemsParams<T extends FilterableItem> {
  allItems: T[];
  selected: number;
  accountStatus: string[];
  transactionType: string[];
  taggedWith: string;
  moneySpent?: [number, number];
  queryValue: string;
}

export function useFilteredItems<T extends FilterableItem>({
  allItems,
  selected,
  accountStatus,
  transactionType,
  taggedWith,
  moneySpent,
  queryValue,
}: UseFilteredItemsParams<T>): T[] {
  return useMemo(() => {
    return allItems.filter((item) => {
      const typeCondition =
        selected === 0 ||
        (selected === 1 && item.type === 'purchases') ||
        (selected === 2 && item.type === 'tokenRedemptions');
      const accountCondition =
        accountStatus.length === 0 || accountStatus.includes(item.order_status);
      const transactionCondition =
        transactionType.length === 0 || transactionType.includes(item.type);
      const taggedCondition =
        isEmpty(taggedWith) || item.campaign_id.includes(taggedWith);
      const moneyCondition =
        moneySpent === undefined ||
        (item.total_amount >= moneySpent[0] && item.total_amount <= moneySpent[1]);
      const queryCondition =
        queryValue === '' ||
        item.shopify_order_id.toString().includes(queryValue) ||
        item.user_wallet.wallet_address.toLowerCase().includes(queryValue.toLowerCase()) ||
        item.campaign_id.toLocaleLowerCase().includes(queryValue.toLocaleLowerCase());

      return (
        typeCondition &&
        accountCondition &&
        transactionCondition &&
        taggedCondition &&
        moneyCondition &&
        queryCondition
      );
    });
  }, [allItems, selected, accountStatus, transactionType, taggedWith, moneySpent, queryValue]);
}
