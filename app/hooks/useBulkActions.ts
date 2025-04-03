import { useFetcher } from '@remix-run/react';
import { DeleteIcon, ExportIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import type { SelectionType, Range } from '@shopify/polaris/build/ts/src/utilities/index-provider/types';

interface UseBulkActionsProps {
  filteredItems: any[];
  deleteFetcher: ReturnType<typeof useFetcher>;
  selectedResources: string[];
  handleExportCSV: () => void;
}

export function useBulkActions({ 
  filteredItems, 
  deleteFetcher, 
  selectedResources: initialSelectedResources,
  handleExportCSV 
}: UseBulkActionsProps) {
  const [selectedResources, setSelectedResources] = useState(initialSelectedResources);

  const handleSelectionChange = (
    selectionType: SelectionType,
    toggleType: boolean,
    selection?: string | Range,
    position?: number
  ) => {
    if (selectionType === 'all') {
      setSelectedResources(toggleType ? filteredItems.map(item => item.id) : []);
    } else if (typeof selection === 'string') {
      setSelectedResources(prev => 
        toggleType 
          ? [...prev, selection] 
          : prev.filter(id => id !== selection)
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;
    if (!confirm('Are you sure you want to delete the selected purchase records?')) return;

    for (const resourceId of selectedResources) {
      const parts = resourceId.split('-');
      const purchaseId = parts.slice(1).join('-');
      deleteFetcher.submit({ id: purchaseId }, { method: 'post', action: '/app/purchase-history' });
    }
  };

  const computedAllSelected = filteredItems.length > 0 && selectedResources.length === filteredItems.length;

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

  return {
    selectedResources,
    handleSelectionChange,
    computedAllSelected,
    handleBulkDelete,
    promotedBulkActions,
    bulkActions
  };
} 