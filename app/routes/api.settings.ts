import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getStoreSettings } from "app/models/settings/Settings.server";
import { verifyShopifyRequest } from "app/utils/shopify/verifyShopifyRequest";

export async function loader({ request }: LoaderFunctionArgs) {
  const uri = new URL(request.url);
  const shop = uri.searchParams.get("shop");

  if (!shop) {
    return new Response(
      JSON.stringify({ error: "Invalid Shop" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  if (!verifyShopifyRequest(uri)) {
    return new Response(
      JSON.stringify({ error: "Invalid Shopify Session" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const settings = await getStoreSettings(shop)

  if(!settings) {
    return new Response(
      JSON.stringify({ error: "Invalid Shopify Session" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return { 
    appId: settings.app_id,
    button: settings.button_ui,
    loader: settings.loader_ui,
  }
}

export async function action({ request }: ActionFunctionArgs) {
 return
}
