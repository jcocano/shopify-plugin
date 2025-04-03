import db from '../../db.server';


export async function getStoreApiKey(shop: string) {
  const store = await db.settings.findFirst({ where: { shop } });

  return store?.api_key
};

export async function getAppId(shop: string) {
  const store = await db.settings.findFirst({ where: { shop } });

  return store?.app_id
};
