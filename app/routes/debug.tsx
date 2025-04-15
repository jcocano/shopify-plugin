import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    
    // Only return non-sensitive information
    return {
      isAuthenticated: !!session,
      shop: session?.shop,
      isOnline: session?.isOnline,
      sessionScopes: session?.scope,
      appUrl: process.env.SHOPIFY_APP_URL,
      apiKey: process.env.SHOPIFY_API_KEY ? "Set" : "Not set",
      apiSecret: process.env.SHOPIFY_API_SECRET ? "Set" : "Not set",
      envScopes: process.env.SCOPES,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    };
  }
};

export default function Debug() {
  return (
    <div>
      <h1>Debug Information</h1>
      <p>This page is for debugging purposes only. Remove it after fixing the issue.</p>
    </div>
  );
} 