import { Select } from "@shopify/polaris";
import { Loader } from "app/components/loader/Loader";
import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { LoaderUiEnum } from "app/models/dtos/settings/Settings.enum";
import { loaderUiStyles } from "app/utils/constants/settings";

interface LoaderSettingsProps {
  settingsData: Partial<StoreSettingsDto>;
  updateSettingsData: <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) => void;
}

export const LoaderSettings: React.FC<LoaderSettingsProps> = ({ settingsData, updateSettingsData }) => {
  return(
    <>
      <Select
        label="Loader Style"
        options={loaderUiStyles}
        onChange={(e) => updateSettingsData('loader_ui', e as LoaderUiEnum)}
        value={settingsData.loader_ui}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0 0 0', 
        backgroundColor: settingsData.loader_ui === LoaderUiEnum.WHITE ? "#e5e7eb" : "transparent",
        }}>
        <Loader
          loaderVariant={settingsData.loader_ui as LoaderUiEnum}
        />
      </div>
    </>
  )
}
