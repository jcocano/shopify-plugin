import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';

export function CampaignSelector({ campaigns, onSelect }) {
  const [selectedCampaign, setSelectedCampaign] = useState('');

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setSelectedCampaign(campaigns[0].id);
      onSelect && onSelect(campaigns[0]);
    }
  }, [campaigns]);

  if (!campaigns || campaigns.length < 2) {
    return null;
  }

  function handleChange(e) {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    const selected = campaigns.find(c => c.id === campaignId);
    onSelect && onSelect(selected);
  }

  return (
    h('div', { className: 'campaign-selector' },
      h('p', null, "You can apply to these campaigns, please select the campaign you want to apply"),
      h('select', { onChange: handleChange, value: selectedCampaign, className: 'form-select' },
        campaigns.map(campaign =>
          h('option', { key: campaign.id, value: campaign.id },
            `${campaign.title} - ${campaign.type}`
          )
        )
      )
    )
  );
}
