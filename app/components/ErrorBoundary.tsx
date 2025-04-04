import { Page, BlockStack, Button, Text, Banner } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error;
  componentStack?: string;
}

export function ErrorBoundary({ error, componentStack }: ErrorBoundaryProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", componentStack);
    
  }, [error, componentStack]);

  return (
    <Page>
      <BlockStack gap="400">
        <Banner tone="critical" title="Something went wrong">
          <p>An unexpected error occurred. We've been notified and are working to fix it.</p>
        </Banner>
        
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">Error Details</Text>
          <Text as="p" variant="bodyMd">
            <strong>Message:</strong> {error.message}
          </Text>
          
          {process.env.NODE_ENV === "development" && (
            <>
              <Text as="h3" variant="headingSm">Stack Trace</Text>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: "0.8rem", 
                color: "#555",
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                maxHeight: "300px"
              }}>
                {error.stack}
              </pre>
              
              {componentStack && (
                <>
                  <Text as="h3" variant="headingSm">Component Stack</Text>
                  <pre style={{ 
                    whiteSpace: "pre-wrap", 
                    fontSize: "0.8rem", 
                    color: "#555",
                    background: "#f5f5f5",
                    padding: "1rem",
                    borderRadius: "4px",
                    overflow: "auto",
                    maxHeight: "300px"
                  }}>
                    {componentStack}
                  </pre>
                </>
              )}
            </>
          )}
        </BlockStack>
        
        <BlockStack gap="200">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </BlockStack>
      </BlockStack>
    </Page>
  );
} 