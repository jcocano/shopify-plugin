import { h, createContext } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';

export const CampaignContext = createContext(null);

export function CampaignProvider({ productId, variantId, children }) {
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (!productId || !variantId) return;
    fetch(`apps/api/campaign?productId=${productId}&variantId=${variantId}`)
      .then(response => response.json())
      .then(data => setCampaign(data))
      .catch(err => console.error('Error fetching campaign:', err));
  }, [productId, variantId]);

  return h(CampaignContext.Provider, { value: campaign }, children);
}
