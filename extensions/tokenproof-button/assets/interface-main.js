import { h } from 'https://esm.sh/preact';
import { useContext } from 'https://esm.sh/preact/hooks';
import { SettingsContext } from './provider-settings.js';
import { CampaignContext } from './provider-campaign.js';
import { AuthContext } from './provider-tokenproof-auth.js';
import { Loader } from './Loader.js';
import { TokenproofAuthButton } from './component-tokenproof-button.js';

export function InterfaceMain() {
  const settings = useContext(SettingsContext);
  const campaign = useContext(CampaignContext);
  const { isAuthenticated } = useContext(AuthContext);

  if (!settings) {
    return null;
  }

  if (campaign === null) {
    return h(Loader, { loaderVariant: settings.loader || 'BLUE' });
  }


  return h(
    'div',
    null,
    isAuthenticated && Array.isArray(campaigns) && campaigns.length >= 2 &&
      h(CampaignSelector, { 
        campaigns, 
        onSelect: (selectedCampaign) => console.log('Campaña seleccionada:', selectedCampaign)
      }),
    h(TokenproofAuthButton, { buttonVariant: settings.button })
  );
}
