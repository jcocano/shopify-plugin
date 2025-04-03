import { Text } from "@shopify/polaris";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import moment from "moment-timezone";

interface GmtLocationProps {
  settingsData: Partial<StoreSettingsDto>;
}

export const GmtLocation: React.FC<GmtLocationProps> = ({ settingsData }) => {
  
  const gmtOffset = settingsData.timezone && settingsData.timezone.includes('/')
    ? moment().tz(settingsData.timezone).format("Z")
    : "";
  
  return(
    <div style={{padding: '5px 15px 0'}}>
      <Text as='p' tone="subdued" variant="bodySm">
      {settingsData.timezone
        ? `Timezone: GMT ${gmtOffset}`
        : "Select a timezone"}
      </Text>
    </div>
  )
}
