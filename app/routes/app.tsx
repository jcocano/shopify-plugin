import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";
import { storeOnboarding } from "app/utils/settings/storeOnboarding";
import { ErrorBoundary as CustomErrorBoundary } from "app/components/ErrorBoundary";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);
    // store data
    const query = await admin.graphql(`{ shop { email myshopifyDomain } }`);
    const storeData = await query.json();
    const shopifyData = storeData.data.shop;

    const settings = await storeOnboarding(shopifyData.myshopifyDomain, shopifyData.email);
    const isTokenproofStoreEnroll = () => !!settings.api_key;

    return { apiKey: process.env.SHOPIFY_API_KEY || "", isTokenproofStoreEnroll };
  } catch (error) {
    console.error("Error in app loader:", error);
    // Return a minimal response that won't break the app
    return { apiKey: process.env.SHOPIFY_API_KEY || "", isTokenproofStoreEnroll: () => false };
  }
};

export default function App() {
  const { apiKey, } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app/campaigns" rel="home">
          Home
        </Link>
        <Link to="/app/campaigns">All Campaigns</Link>
        <Link to="/app/campaign/new">Create Campaigns</Link>
        <Link to="/app/purchases">Purchase History</Link>
        <Link to="/app/settings">Settings</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Custom error boundary that handles authentication errors
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("App error boundary caught:", error);
  
  // Check if it's an authentication error
  if (error instanceof Error && 
      (error.message.includes("shop") || 
       error.message.includes("authentication") || 
       error.message.includes("session"))) {
    return (
      <AppProvider isEmbeddedApp apiKey={process.env.SHOPIFY_API_KEY || ""}>
        <CustomErrorBoundary 
          error={error} 
          componentStack={error instanceof Error ? error.stack : undefined} 
        />
      </AppProvider>
    );
  }
  
  // For other errors, use the Shopify boundary
  return boundary.error(error);
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
