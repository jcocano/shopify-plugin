import { Select } from "@shopify/polaris";
import { TokenproofConnectButton } from "app/components/tokenproof-button/TokenproofConnectButton";

import { StoreSettingsDto } from "app/models/dtos/settings/Settings.dto";
import { ButtonUiEnum } from "app/models/dtos/settings/Settings.enum";
import { buttonUiStyles } from "app/utils/constants/settings";

interface ButtonSettingsProps {
  settingsData: Partial<StoreSettingsDto>;
  updateSettingsData: <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) => void;
}

export const ButtonSettings: React.FC<ButtonSettingsProps> = ({ settingsData, updateSettingsData }) => {
  return(
    <>
      <Select
      label="Button Style"
      options={buttonUiStyles}
      onChange={(e) => updateSettingsData('button_ui', e as ButtonUiEnum)}
      value={settingsData.button_ui}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0 0 0',
        }}>
        <TokenproofConnectButton 
          tokenproofVariant={settingsData.button_ui as ButtonUiEnum} 
        />
      </div>
    </>
  )
}
