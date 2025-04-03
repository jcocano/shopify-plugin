import { useState } from "react";
import { Button } from "@shopify/polaris";
import { CampaignSelectedProductsDto } from "app/models/dtos/campaigns/CampaignSelectedProducts.dto";

interface ProductPickerProps {
  selectedProducts: CampaignSelectedProductsDto[];
  onProductsSelected: (products: CampaignSelectedProductsDto[]) => void;
}

export const ProductPicker: React.FC<ProductPickerProps> = ({ selectedProducts, onProductsSelected }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openPicker = async () => {
    if (!window.shopify?.picker) {
      console.error("Shopify Picker API is not available.");
      return;
    }

    setIsLoading(true);
    try {
      const selection = await window.shopify.resourcePicker({
        type: "product",
        action: "select",
        multiple: true,
        filter: { hidden: false },
      });

      if (!selection) return;

      const mappedProducts: CampaignSelectedProductsDto[] = selection.map((product: any) => ({
        product_id: product.id.split("/").pop(), 
        title: product.title,
        image_url: product.images?.[0]?.originalSrc || 'https://yuga.com/share.jpg',
        variantId: product.variants?.[0]?.id.split("/").pop() || undefined,
        variantTitle: product.variants?.[0]?.title || undefined,
      }));


      const updatedProducts = [...selectedProducts, ...mappedProducts].filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.product_id === product.product_id)
      );

      onProductsSelected(updatedProducts);
    } catch (error) {
      console.error("Product picker closed or error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <Button onClick={openPicker} loading={isLoading}>Select Products</Button>;
};
