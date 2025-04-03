import db from '../../db.server';
import { StoreSettingsDto } from '../dtos/settings/Settings.dto';
import { ButtonUiEnum, LoaderUiEnum } from '../dtos/settings/Settings.enum'


export async function createStoreSettings(shop: string, data: StoreSettingsDto) {
  return await db.settings.create({ data })
};

export async function getStoreSettings(shop: string) {
  return await db.settings.findFirst({ where: { shop } });
};

export async function updateStoreSettings(shop: string, data: Partial<StoreSettingsDto>) {
  return await db.settings.update({ 
    where: {
      shop,
    },
    data,
  });
};

export function validateStoreSettings(data: Partial<StoreSettingsDto>) {
  if (!data.button_ui) {
    data.button_ui = ButtonUiEnum.BLUE;
  }

  if (!data.loader_ui) {
    data.loader_ui = LoaderUiEnum.BLUE;
  }

  if (!data.timezone) {
    data.timezone = "Etc/UTC";
  }
}
