import { EmptyState, LegacyCard, Page } from "@shopify/polaris";
import { useNavigate } from '@remix-run/react';


export const CampaingsEmptySatate = () => {
  const navigate = useNavigate();

  function newCampaing() {
    navigate(`/app/campaign/new`);
  }
  
  return (
    <Page
      title="campaigns"
      subtitle="Get started by creating your first campaign and let the good times roll!"
      compactTitle
      primaryAction={{
        content: 'New campaign', 
        disabled: false, 
        onAction: () => newCampaing(),
      }}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
    <LegacyCard sectioned>
      <EmptyState
        heading="Create Your First Campaign and Unlock the Benefits!"
        action={{ content: "Create Campaign", onAction:() => newCampaing(), }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        fullWidth
      >
        <p>
          Start your journey with token-gated campaigns and give your customers exclusive access. Tap the button below to create your first campaign now!
        </p>
      </EmptyState>
    </LegacyCard>
    </Page>
  );
};