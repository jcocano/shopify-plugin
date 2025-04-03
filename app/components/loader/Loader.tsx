import type { HTMLAttributes } from "react"
import { LoaderUiEnum } from "@prisma/client"
import styles from "./Loader.module.css"

interface loaderProps extends HTMLAttributes<HTMLDivElement> {
  loaderVariant?: LoaderUiEnum
}

export function Loader({ loaderVariant = LoaderUiEnum.BLUE, className, ...props }: loaderProps) {
  const getLoaderClass = () => {
    switch (loaderVariant) {
      case LoaderUiEnum.BLUE:
        return styles.loaderBlue
      case LoaderUiEnum.BLACK:
        return styles.loaderBlack
      case LoaderUiEnum.WHITE:
        return styles.loaderWhite
      default:
        return styles.loaderBlue
    }
  }

  const loaderClasses = [styles.loaderBase, getLoaderClass(), className].filter(Boolean).join(" ")

  return (
    <div className={loaderClasses} {...props} role="status">
      <div className={styles.spinner}></div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  )
}

