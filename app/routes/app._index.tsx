import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import { BlockStack, Page } from "@shopify/polaris";

interface ErrorBoundaryProps {
  error: Error;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { redirect } = await authenticate.admin(request);

  return redirect("/app/campaigns");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { redirect } = await authenticate.admin(request);

  return redirect("/app/campaigns");
};

export default function Index() {
  return null;
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  console.error("ErrorBoundary caught an error:", error);

  return (
    <Page title="Error">
      <BlockStack gap="400">      
        <h1>Something went wrong</h1>
        <p>
          An unexpected error occurred. Please try reloading the page. If the issue persists, contact support.
        </p>
      </BlockStack>
    </Page>
  );
}
