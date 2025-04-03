import { ButtonUiEnum, LoaderUiEnum } from './Settings.enum';

export interface StoreSettingsDto {
  shop: string;
  api_key: string;
  app_id: string;
  timezone: string;
  button_ui: ButtonUiEnum;
  loader_ui: LoaderUiEnum;
}

export function createStoreSettingsDto(
  data?: Partial<StoreSettingsDto>
): StoreSettingsDto {
  return {
    shop: data?.shop || "",
    api_key: data?.api_key || "",
    app_id: data?.app_id || "",
    timezone: data?.timezone || "",
    button_ui: data?.button_ui || ButtonUiEnum.BLUE,
    loader_ui: data?.loader_ui || LoaderUiEnum.BLUE,
  };
}
