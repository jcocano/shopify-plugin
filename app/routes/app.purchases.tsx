import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import {
  Page,
  LegacyCard,
  useIndexResourceState,
  useSetIndexFiltersMode,
  IndexFiltersMode,
} from '@shopify/polaris';
import { DeleteIcon, ExportIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { getTransactionFiltersConfig } from 'app/components/campaings/products/TransactionFiltersConfig';
import { ClientOnly } from 'app/components/ClientOnly';
import { TransactionDetailsModal } from 'app/components/purchaseData/TransactionDetailsModal';
import { TransactionFilters } from 'app/components/purchaseData/TransactionFilters';
import { TransactionsTable } from 'app/components/purchaseData/TransactionsTable';
import { useFilteredItems } from 'app/hooks/useFilteredItems';
import { useMergedItems } from 'app/hooks/useMergedPurchaseItems';
import { useTransactionFilters } from 'app/hooks/useTransactionFilters';
import { getPurchaseDatas, deletePurchaseData } from 'app/models/purchases/PurchaseData.server';
import { purchaseDataShortOptions } from 'app/utils/constants/purchaseDataShortOptions';
import { exportToCSV } from 'app/utils/misc/exportToCSV';
import { copyToClipboard } from 'app/utils/purchaseData/copyToClipboard';
import { getShopDomain } from 'app/utils/shopify/getShopDomain';
import { authenticate } from 'app/shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  const shopDomain = await getShopDomain(request);
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const size = Number(url.searchParams.get('size')) || 25;

  const { result, filterRecords, totalRecords } = await getPurchaseDatas(shopDomain, size, offset);

  // Separate tokenRedemptions from campaignPurchases
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
  const formData = await request.formData();
  const shopDomain = await getShopDomain(request);
  const id = formData.get('id');

  if (typeof id !== 'string') {
    throw new Response('Invalid purchase ID', { status: 400 });
  }
  await deletePurchaseData(shopDomain, id);

  return redirect('/app/purchase-history');
}

export default function Purchases() {
  // Load data from the loader
  const { campaignPurchases, tokenRedemptions, totalRecords, size, offset } =
    useLoaderData<typeof loader>();

  const deleteFetcher = useFetcher();

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;
    if (!confirm('Are you sure you want to delete the selected purchase records?')) return;

    for (const resourceId of selectedResources) {
      // resourceId is like "purchase-<uuid>" or "token-<uuid>"
      const parts = resourceId.split('-');
      const purchaseId = parts.slice(1).join('-');
      deleteFetcher.submit({ id: purchaseId }, { method: 'post', action: '/app/purchase-history' });
    }
  };

  // Search params for pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const currentOffset = Number(searchParams.get('offset')) || offset;
  const currentSize = Number(searchParams.get('size')) || size;

  // Pagination
  const onNext = () => {
    const nextOffset = currentOffset + currentSize;
    searchParams.set('offset', nextOffset.toString());
    setSearchParams(searchParams);
  };
  const onPrevious = () => {
    const prevOffset = Math.max(0, currentOffset - currentSize);
    searchParams.set('offset', prevOffset.toString());
    setSearchParams(searchParams);
  };

  const hasNext = currentOffset + currentSize < totalRecords;
  const hasPrevious = currentOffset > 0;

  // Local states for filters
  const [sortSelected, setSortSelected] = useState(['date desc']);
  const [itemStrings] = useState(['All', 'Purchases', 'Token Redemptions']);
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  // Hook for transaction filters
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

  // Merge items from two arrays
  const allItems = useMergedItems(campaignPurchases, tokenRedemptions);

  // Filter items based on active filters
  const filteredItems = useFilteredItems({
    allItems,
    selected,
    accountStatus,
    transactionType,
    taggedWith,
    moneySpent,
    queryValue,
  });

  // Selection state from Polaris
  const { selectedResources, handleSelectionChange } =
    useIndexResourceState(allItems);

  // Manually compute if all filtered items are selected
  const computedAllSelected =
    filteredItems.length > 0 && selectedResources.length === filteredItems.length;

  // Config for filters
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

  // Tabs
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  // Click row -> show details
  const handleRowClick = useCallback((item: any) => {
    setSelectedPurchase(item);
    setModalOpen(true);
  }, []);

  // CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredItems, 'orders.csv');
  };

  // Bulk actions
  const promotedBulkActions = [
    {
      content: 'Export as CSV',
      onAction: handleExportCSV,
      icon: ExportIcon,
    },
  ];
  const bulkActions = [
    {
      content: 'Delete',
      onAction: handleBulkDelete,
      icon: DeleteIcon,
      destructive: true,
    },
  ];

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
