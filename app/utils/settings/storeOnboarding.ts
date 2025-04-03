import { ButtonUiEnum, LoaderUiEnum } from "@prisma/client";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { getStoreSettings, createStoreSettings } from "app/models/settings/Settings.server";

export async function storeOnboarding(shopDomain: string, email?: string): Promise<StoreSettingsDto> {
  let settings = await getStoreSettings(shopDomain);
  if (!settings) {
    const onboardingPayload = {
      storeName: shopDomain,
      storeDomain: shopDomain,
      email,
    };

    const response = await fetch(`${process.env.TOKENPROOF_API_URL}/shopify/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingPayload),
    });

    if (!response.ok) {
      throw new Error('Onboarding Error');
    }

    const onboardingData = await response.json();

    const initialSettings: StoreSettingsDto = {
      shop: shopDomain,
      api_key: onboardingData.apiKey || '',
      app_id: onboardingData.appId || '',
      timezone: "Africa/Abidjan",
      button_ui: ButtonUiEnum.BLUE,
      loader_ui: LoaderUiEnum.BLUE,
    };

    settings = await createStoreSettings(shopDomain, initialSettings);

  }
  return settings;
}
