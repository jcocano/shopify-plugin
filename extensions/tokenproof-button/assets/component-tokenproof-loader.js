import { h } from 'https://esm.sh/preact';
import { useContext } from 'https://esm.sh/preact/hooks';
import { SettingsContext } from './provider-settings.js';
import { getLoaderClass } from './helper-visuals.js';

export function Loader() {
  const settings = useContext(SettingsContext);
  const loaderVariant = settings && settings.loader ? settings.loader : 'BLUE';
  const variantClass = getLoaderClass(loaderVariant);
  const loaderClasses = ['loaderBase', variantClass].join(' ');

  return h(
    'div',
    { className: loaderClasses, role: 'status' },
    h('div', { className: 'spinner' }),
    h('span', { className: 'srOnly' }, 'Loading...')
  );
}
