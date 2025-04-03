import { InlineGrid, Box, BlockStack, Card, InlineStack, Button, Text } from "@shopify/polaris";
import { ThemeEditIcon } from '@shopify/polaris-icons';
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { ButtonSettings } from "./ButtonSettings";
import { LoaderSettings } from "./LoaderSettings";

interface CustomizationSettingsProps {
  settingsData: Partial<StoreSettingsDto>;
  updateSettingsData: <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) => void;
}

export const CustomizationSettings: React.FC<CustomizationSettingsProps> = ({ settingsData, updateSettingsData }) => {
  return(
    <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
      <Box
        as="section"
        paddingInlineStart={{ xs: "400", sm: "0" }}
        paddingInlineEnd={{ xs: "400", sm: "0" }}
      >
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Tokenproof Button
          </Text>
          <Text as="p" variant="bodyMd">
            Select the colors that match your store's theme.
          </Text>
        </BlockStack>
      </Box>
      <Card roundedAbove="sm">
        <InlineStack align='end'>
          <Button
            icon={ThemeEditIcon}
            variant="plain"
            onClick={() => console.log('TBD on theme extention')}
            accessibilityLabel="Preview on theme"
          >
            Preview on theme
          </Button>
        </InlineStack>
        <InlineGrid columns={'2'} gap="400">
          <ButtonSettings settingsData={settingsData} updateSettingsData={updateSettingsData}/>
          <LoaderSettings settingsData={settingsData} updateSettingsData={updateSettingsData}/>
        </InlineGrid>
      </Card>
    </InlineGrid>
  )
}
