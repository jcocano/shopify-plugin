import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError, useNavigate, NavLink } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Frame } from "@shopify/polaris";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { Toast } from "@shopify/polaris";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import { storeOnboarding } from "app/utils/settings/storeOnboarding";
import { ErrorBoundary as CustomErrorBoundary } from "app/components/ErrorBoundary";
import enTranslations from '@shopify/polaris/locales/en.json';

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// Create a Toast context to manage toast notifications across the app
export type ToastContextType = {
  showToast: (message: string, error?: boolean) => void;
};

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const apiKey = process.env.SHOPIFY_API_KEY || "";
  
  try {
    console.log("App loader: Starting authentication");
    const { redirect } = await authenticate.admin(request);
    
    // If redirect is returned, it means we need to authenticate
    if (redirect) {
      console.log("App loader: Authentication required, redirecting to:", redirect);
      return redirect;
    }
    
    console.log("App loader: Authentication successful");
    
    // store data
    const query = await admin.graphql(`{ shop { email myshopifyDomain } }`);
    const storeData = await query.json();
    const shopifyData = storeData.data.shop;

    const settings = await storeOnboarding(shopifyData.myshopifyDomain, shopifyData.email);
    const isTokenproofStoreEnroll = false; // Simplified for now

    return json({
      apiKey,
      isTokenproofStoreEnroll
    });
  } catch (error) {
    console.error("Error in app loader:", error);
    return json({
      apiKey,
      isTokenproofStoreEnroll: false
    });
  }
};

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  
  // If loaderData is null, it means we're being redirected
  if (!loaderData) {
    return null;
  }
  
  const { apiKey, isTokenproofStoreEnroll } = loaderData;
  
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <NavLink
          to="/app"
          end
          style={({ isActive }: { isActive: boolean }) => ({
            color: isActive ? "rgb(var(--p-text))" : "rgb(var(--p-text-subdued))",
            background: isActive ? "rgb(var(--p-surface-selected))" : "transparent",
          })}
        >
          home
        </NavLink>
        <NavLink
          to="/app/settings"
          style={({ isActive }: { isActive: boolean }) => ({
            color: isActive ? "rgb(var(--p-text))" : "rgb(var(--p-text-subdued))",
            background: isActive ? "rgb(var(--p-surface-selected))" : "transparent",
          })}
        >
          Settings
        </NavLink>
      </ui-nav-menu>
      <Frame>
        <Outlet context={{ apiKey, isTokenproofStoreEnroll }} />
      </Frame>
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
