import type { ButtonHTMLAttributes } from "react"
import { ButtonUiEnum } from "@prisma/client"
import { TokenproofIcon } from "./TokenproofIcon"
import styles from "./TokenproofConnectButton.module.css"

interface TokenproofConnectButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tokenproofVariant?: ButtonUiEnum
}

export function TokenproofConnectButton({
  tokenproofVariant = ButtonUiEnum.BLUE,
  className,
  ...props
}: TokenproofConnectButtonProps) {
  const getIconColor = () => {
    switch (tokenproofVariant) {
      case ButtonUiEnum.BLUE:
        return "#2563eb"
      case ButtonUiEnum.BLACK:
        return "#000000"
      case ButtonUiEnum.WHITE:
        return "#FFFFFF"
      default:
        return "#2563eb"
    }
  }

  const getButtonClass = () => {
    switch (tokenproofVariant) {
      case ButtonUiEnum.BLUE:
        return styles.buttonBlue
      case ButtonUiEnum.BLACK:
        return styles.buttonBlack
      case ButtonUiEnum.WHITE:
        return styles.buttonWhite
      default:
        return styles.buttonBlue
    }
  }

  const buttonClasses = [styles.buttonBase, getButtonClass(), className].filter(Boolean).join(" ")

  return (
    <button className={buttonClasses} type="button" {...props}>
      <TokenproofIcon color={getIconColor()} className={styles.icon} />
      Connect tokenproof
    </button>
  )
}

