import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { Frame, Toast } from "@shopify/polaris";
import { useState, createContext, useContext, useEffect, useRef } from "react";

import { authenticate } from "../shopify.server";
import { storeOnboarding } from "app/utils/settings/storeOnboarding";
import { ErrorBoundary as CustomErrorBoundary } from "app/components/ErrorBoundary";

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
  const { apiKey } = useLoaderData<typeof loader>();
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para mostrar el toast
  const showToast = (message: string, error = false) => {
    console.log("Showing toast:", message, "error:", error);
    
    // Limpia cualquier temporizador existente para evitar duplicados
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Actualiza el estado del toast
    setToastMessage(message);
    setToastError(error);
    setToastActive(true);
    
    // Configura el temporizador para ocultar automáticamente el toast
    timeoutRef.current = setTimeout(() => {
      setToastActive(false);
      timeoutRef.current = null;
    }, 4000); // 4 segundos
  };

  // Limpia cualquier temporizador pendiente cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ToastContext.Provider value={{ showToast }}>
        <Frame>
          <NavMenu>
            <Link to="/app/campaigns" rel="home">
              Home
            </Link>
            <Link to="/app/campaigns">All Campaigns</Link>
            <Link to="/app/editor/campaign/new">Create Campaigns</Link>
            <Link to="/app/purchases">Purchase History</Link>
            <Link to="/app/settings">Settings</Link>
          </NavMenu>
          {toastActive && (
            <Toast
              content={toastMessage}
              error={toastError}
              onDismiss={() => {
                console.log("Toast dismissed");
                setToastActive(false);
              }}
            />
          )}
          <Outlet />
        </Frame>
      </ToastContext.Provider>
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
