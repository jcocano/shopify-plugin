// provider-settings.js
import { h, createContext } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('apps/api/settings')
      .then(response => response.json())
      .then(data => {
        setSettings({
          appId: data.app_id,
          button: data.button_ui,
          loader: data.loader_ui
        });
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return h(SettingsContext.Provider, { value: settings }, children);
}
