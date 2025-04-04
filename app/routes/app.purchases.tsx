import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Page, LegacyCard, useSetIndexFiltersMode, IndexFiltersMode, BlockStack, Button } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { getTransactionFiltersConfig } from 'app/components/campaings/products/TransactionFiltersConfig';
import { ClientOnly } from 'app/components/ClientOnly';
import { TransactionDetailsModal } from 'app/components/purchaseData/TransactionDetailsModal';
import { TransactionFilters } from 'app/components/purchaseData/TransactionFilters';
import { TransactionsTable } from 'app/components/purchaseData/TransactionsTable';
import { useFilteredItems } from 'app/hooks/useFilteredItems';
import { useMergedItems } from 'app/hooks/useMergedPurchaseItems';
import { useTransactionFilters } from 'app/hooks/useTransactionFilters';
import { usePagination, useBulkActions } from 'app/hooks';
import { purchaseDataShortOptions } from 'app/utils/constants/purchaseDataShortOptions';
import { exportToCSV } from 'app/utils/misc/exportToCSV';
import { copyToClipboard } from 'app/utils/purchaseData/copyToClipboard';
import {authenticate} from '../shopify.server';
import { deletePurchaseData } from 'app/models/purchases/PurchaseData.server';

interface ErrorBoundaryProps {
  error: Error;
}

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("campaign editor loader")
  const { admin } = await authenticate.admin(request);
  console.log("campaign edito authenticate")
  
  const query = await admin.graphql(`{ shop { myshopifyDomain } }`);
  const storeData = await query.json();
  const shopifyDomain = storeData.data.shop.myshopifyDomain;

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const size = Number(url.searchParams.get('size')) || 25;

  const { getPurchaseDatas } = await import('app/models/purchases/PurchaseData.server');
  const { result, filterRecords, totalRecords } = await getPurchaseDatas(shopifyDomain, size, offset);

  const { tokenRedemptions, campaignPurchases } = result.reduce(
    (acc, purchase) => {
      if (purchase.campaign.type === 'TOKEN_REDEMPTION') {
        acc.tokenRedemptions.push(purchase);
      } else {
        acc.campaignPurchases.push(purchase);
      }
      return acc;
    },
    { tokenRedemptions: [] as typeof result, campaignPurchases: [] as typeof result }
  );

  return { campaignPurchases, tokenRedemptions, filterRecords, totalRecords, size, offset };
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("purchases action")
  const {admin, redirect} = await authenticate.admin(request);
  console.log("purchases action authenticate")
  
  const query = await admin.graphql(`{ shop { myshopifyDomain } }`);
  const storeData = await query.json();
  const shopifyDomain = storeData.data.shop.myshopifyDomain;

  const formData = await request.formData();
  const id = formData.get('id');

  if (typeof id !== 'string') {
    throw new Response('Invalid purchase ID', { status: 400 });
  }

  await deletePurchaseData(shopifyDomain, id);

  return redirect('/app/purchase-history');
}

export default function Purchases() {
  const { campaignPurchases, tokenRedemptions, totalRecords, size, offset } = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [sortSelected, setSortSelected] = useState(['date desc']);
  const [itemStrings] = useState(['All', 'Purchases', 'Token Redemptions']);
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  // Pagination logic
  const { 
    currentOffset, 
    currentSize, 
    onNext, 
    onPrevious, 
    hasNext, 
    hasPrevious 
  } = usePagination({ 
    searchParams, 
    setSearchParams, 
    offset, 
    size, 
    totalRecords 
  });

  // Filter state and handlers
  const {
    queryValue,
    accountStatus,
    moneySpent,
    taggedWith,
    transactionType,
    handleAccountStatusChange,
    handleMoneySpentChange,
    handleTaggedWithChange,
    handleTransactionTypeChange,
    handleFiltersQueryChange,
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleTaggedWithRemove,
    handleTransactionTypeRemove,
    handleFiltersClearAll,
  } = useTransactionFilters();

  // Data processing
  const allItems = useMergedItems(campaignPurchases, tokenRedemptions);
  const filteredItems = useFilteredItems({
    allItems,
    selected,
    accountStatus,
    transactionType,
    taggedWith,
    moneySpent,
    queryValue,
  });

  // Selection and bulk actions
  const { 
    selectedResources, 
    handleSelectionChange, 
    computedAllSelected,
    handleBulkDelete,
    promotedBulkActions,
    bulkActions
  } = useBulkActions({
    filteredItems,
    deleteFetcher,
    selectedResources: [],
    handleExportCSV: () => exportToCSV(filteredItems, 'orders.csv')
  });

  // Filter configuration
  const { filters, appliedFilters } = getTransactionFiltersConfig({
    accountStatus,
    transactionType,
    taggedWith,
    moneySpent,
    handleAccountStatusChange,
    handleTransactionTypeChange,
    handleTaggedWithChange,
    handleMoneySpentChange,
    handleAccountStatusRemove,
    handleTransactionTypeRemove,
    handleTaggedWithRemove,
    handleMoneySpentRemove,
  });

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const handleRowClick = useCallback((item: any) => {
    setSelectedPurchase(item);
    setModalOpen(true);
  }, []);

  return (
    <Page title="Purchase History" subtitle="🛍️ Purchases made by shoppers using this plugin">
      <LegacyCard>
        <TransactionFilters
          sortOptions={purchaseDataShortOptions}
          sortSelected={sortSelected}
          onSort={setSortSelected}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          filters={filters}
          appliedFilters={appliedFilters}
          queryValue={queryValue}
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => handleFiltersQueryChange('')}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <ClientOnly>
          <TransactionsTable
            items={filteredItems}
            selectedResources={selectedResources}
            allResourcesSelected={computedAllSelected}
            onSelectionChange={handleSelectionChange}
            handleRowClick={handleRowClick}
            bulkActions={bulkActions}
            promotedBulkActions={promotedBulkActions}
            pagination={{
              hasNext,
              onNext,
              hasPrevious,
              onPrevious,
            }}
          />
        </ClientOnly>
      </LegacyCard>
      <TransactionDetailsModal
        open={modalOpen}
        selectedPurchase={selectedPurchase}
        onClose={() => setModalOpen(false)}
        copyToClipboard={() => copyToClipboard(selectedPurchase)}
      />
    </Page>
  );
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
        <div>
          <strong>Error Message:</strong> {error.message}
        </div>
        {error.stack && (
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "#555" }}>
            {error.stack}
          </pre>
        )}
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </BlockStack>
    </Page>
  );
}
