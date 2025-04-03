import { useState } from "react";
import { Card, ResourceList, Avatar, ResourceItem, Text, Button } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { motion } from "framer-motion";
import { CampaignSelectedProductsDto } from "app/models/dtos/campaigns/CampaignSelectedProducts.dto";

interface CampaignSelectedProductListProps {
  items: CampaignSelectedProductsDto[];
  updateCampaignData: (key: "selected_products", value: CampaignSelectedProductsDto[]) => void;
}

const ITEMS_PER_PAGE = 2;

export const CampaignSelectedProductList: React.FC<CampaignSelectedProductListProps> = ({
  items,
  updateCampaignData,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
    );
  };

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const bulkActions = [
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete selected products",
      onAction: () => {
        const updatedItems = items.filter((item) => !selectedItems.includes(item.product_id));
        updateCampaignData("selected_products", updatedItems);
        setSelectedItems([]);
      },
    },
  ];

  const paginatedItems = items.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card padding="0">
        <ResourceList
          resourceName={resourceName}
          items={paginatedItems}
          bulkActions={bulkActions}
          selectedItems={selectedItems}
          showHeader
          totalItemsCount={items.length}
          onSelectionChange={(selected) =>
            setSelectedItems(Array.isArray(selected) ? selected : [selected])
          }
          pagination={{
            hasNext: (pageIndex + 1) * ITEMS_PER_PAGE < items.length,
            onNext: () => setPageIndex((prev) => prev + 1),
            hasPrevious: pageIndex > 0,
            onPrevious: () => setPageIndex((prev) => prev - 1),
          }}
          renderItem={(item) => {
            const { product_id, title, image_url, variantTitle } = item;

            const media = image_url ? (
              <Avatar customer size="md" name={title} source={image_url} />
            ) : (
              <Avatar customer size="md" name={title} />
            );

            return (
              <ResourceItem
                id={product_id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
                onClick={() => handleSelectItem(product_id)}
              >
                <div style={{ minHeight: "60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text as="h3" variant="headingSm" fontWeight="bold">
                    {title} {variantTitle ? `(${variantTitle})` : ""}
                  </Text>
                </div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </motion.div>
  );
};
