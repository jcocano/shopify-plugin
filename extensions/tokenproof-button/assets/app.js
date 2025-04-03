import { h, render } from 'https://esm.sh/preact';
import { SettingsProvider } from './provider-settings.js';
import { CampaignProvider } from './provider-campaign.js';
import { TokenproofAuthProvider } from './provider-tokenproof-auth.js';
import { MainInterface } from './interface-main.js';

document.addEventListener('DOMContentLoaded', () => {
  const productId = window.productId;
  const variantId = window.variantId;
  const container = document.getElementById('tokenproof-app');
  if (container) {
    render(
      h(SettingsProvider, null,
        h(CampaignProvider, { productId, variantId },
          h(TokenproofAuthProvider, null,
            h(MainInterface, null)
          )
        )
      ),
      container
    );
  }
});
