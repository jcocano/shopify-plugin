import { useMemo } from 'react';

export function useMergedItems(campaignPurchases: any[], tokenRedemptions: any[]): any[] {
  return useMemo(() => {
    return [
      ...campaignPurchases.map((item: any) => ({
        ...item,
        type: 'purchases',
        uniqueId: `purchase-${item.id}`,
      })),
      ...tokenRedemptions.map((item: any) => ({
        ...item,
        type: 'tokenRedemptions',
        uniqueId: `token-${item.id}`,
      })),
    ];
  }, [campaignPurchases, tokenRedemptions]);
}
