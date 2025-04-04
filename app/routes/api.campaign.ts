import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { getCampaignByProduct } from "app/models/campaigns";
import { verifyShopifyRequest } from "app/utils/shopify/verifyShopifyRequest";

export async function loader({ request }: LoaderFunctionArgs) {
  const uri = new URL(request.url);
  const shop = uri.searchParams.get("shop");
  const productId = uri.searchParams.get("productId")
  const variantId = uri.searchParams.get("variantId") || undefined;

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
  
  if (!productId) {
    return new Response(
      JSON.stringify({ error: "productId are required" }),
      { status: 400, headers: { "Content-Type": "application/json" }},
    );  
  }

  return getCampaignByProduct(shop, productId, variantId )
}

export async function action({ request }: ActionFunctionArgs) {
 return new Response(JSON.stringify({ message: "ok" }), { status: 200 })
}
