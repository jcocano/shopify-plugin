import { h } from 'https://esm.sh/preact';
import { useContext } from 'https://esm.sh/preact/hooks';
import { AuthContext } from './provider-tokenproof-auth.js';
import { SettingsContext } from './provider-settings.js';
import { TokenproofLogo } from './component-tokenproof-logo.js';
import { getButtonClass } from './helper-visuals.js';

export function TokenproofAuthButton() {
  const { isAuthenticated, toggleAuth } = useContext(AuthContext);
  const settings = useContext(SettingsContext);
  const buttonVariant = settings && settings.button ? settings.button : 'BLUE';
  const buttonClass = getButtonClass(buttonVariant);

  return h(
    'button',
    {
      className: `tokenproof-btn ${buttonClass}`,
      onClick: toggleAuth
    },
    h(TokenproofLogo, null),
    isAuthenticated ? 'Disconnect from tokenproof' : 'Connect with tokenproof'
  );
}
