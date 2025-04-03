import React from 'react';
import {
  IndexTable,
  Link,
  Text,
  useBreakpoints,
  type IndexTableProps,
} from '@shopify/polaris';
import { StatusBadge } from 'app/components/purchaseData/StatusBadge';

interface TransactionsTableProps {
  items: any[];
  selectedResources: string[];
  allResourcesSelected: boolean;
  onSelectionChange: IndexTableProps['onSelectionChange'];
  handleRowClick: (item: any) => void;
  bulkActions: {
    content: string;
    onAction: () => void;
    icon: React.ComponentType<any>;
    destructive?: boolean;
  }[];
  promotedBulkActions: {
    content: string;
    onAction: () => void;
    icon: React.ComponentType<any>;
  }[];
  pagination: {
    hasNext: boolean;
    onNext: () => void;
    hasPrevious: boolean;
    onPrevious: () => void;
  };
}

export function TransactionsTable({
  items,
  selectedResources,
  allResourcesSelected,
  onSelectionChange,
  handleRowClick,
  bulkActions,
  promotedBulkActions,
  pagination,
}: TransactionsTableProps) {

  const rowMarkup = items.map((item, index) => (
    <IndexTable.Row
      id={item.uniqueId}
      key={item.uniqueId}
      selected={selectedResources.includes(item.uniqueId)}
      position={index}
    >
      <IndexTable.Cell>
        <Link dataPrimaryLink onClick={() => handleRowClick(item)}>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {item.shopify_order_id}
          </Text>
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{item.campaign_id}</IndexTable.Cell>
      <IndexTable.Cell>{item.user_wallet.wallet_address}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {item.total_amount}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <StatusBadge status={item.order_status} />
      </IndexTable.Cell>
      <IndexTable.Cell>{item.order_date || '-'}</IndexTable.Cell>
      <IndexTable.Cell>
        {item.type === 'purchases' ? 'Purchase' : 'Token Redemption'}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const resourceName = {
    singular: 'transaction',
    plural: 'transactions',
  };

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={items.length}
      selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
      onSelectionChange={onSelectionChange}
      headings={[
        { title: 'Transaction ID' },
        { title: 'Campaign ID' },
        { title: 'Customer' },
        { title: 'Order Amount', alignment: 'center' },
        { title: 'Status' },
        { title: 'Transaction Date' },
        { title: 'Type' },
      ]}
      bulkActions={bulkActions}
      promotedBulkActions={promotedBulkActions}
      pagination={pagination}
    >
      {rowMarkup}
    </IndexTable>
  );
}
