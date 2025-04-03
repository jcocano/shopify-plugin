import { InlineGrid, Box, Card, Select, Text } from "@shopify/polaris";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { getAreaOptions, getIanaTimezones, getLocationOptions } from "app/utils/timezones/getTimezoneOptions";
import { useState } from "react";
import { GmtLocation } from "./GmtLocation";

interface SettingsDetailsProps {
  settingsData: Partial<StoreSettingsDto>;
  updateSettingsData: <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) => void;
}

export const TimezoneSelector: React.FC<SettingsDetailsProps> = ({ settingsData, updateSettingsData }) => {
  const ianaTimezones = getIanaTimezones();
  const areaOptions = getAreaOptions(ianaTimezones);

  let initialArea = areaOptions[0]?.value || "";
  let initialLocation = "";
  if (settingsData.timezone && settingsData.timezone.includes("/")) {
    const parts = settingsData.timezone.split("/");
    initialArea = parts[0];
    initialLocation = parts.slice(1).join("/");
  }

  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const rawLocationOptions = getLocationOptions(ianaTimezones, selectedArea);
  const transformedLocationOptions = rawLocationOptions.map(option => ({
    ...option,
    label: option.label.replace(/_/g, " ")
  }));
  
  const locationOptions = [
    { label: "Select location", value: "" },
    ...transformedLocationOptions,
  ];

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setSelectedLocation("");
    updateSettingsData("timezone", value);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    const combined = `${selectedArea}/${value}`;
    updateSettingsData("timezone", combined);
  };

  return (
    <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
      <Box
        as="section"
        paddingInlineStart={{ xs: "400", sm: "0" }}
        paddingInlineEnd={{ xs: "400", sm: "0" }}
      >
        <Text as="h3" variant="headingMd">
          Timezone
        </Text>
        <Text as="p" variant="bodyMd">
          Please provide your timezone
        </Text>
      </Box>
      <Card roundedAbove="sm">
        <InlineGrid columns={{ xs: "1fr", md: "2.5fr 2.5fr" }} gap="400">
          <Select
            label="Area"
            options={areaOptions}
            value={selectedArea}
            onChange={handleAreaChange}
          />
          <Select
            label="Location"
            options={locationOptions}
            value={selectedLocation}
            onChange={handleLocationChange}
          />
        </InlineGrid>
        <GmtLocation settingsData={settingsData} />
      </Card>
    </InlineGrid>
  );
};
