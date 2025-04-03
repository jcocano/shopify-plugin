import { ButtonUiEnum, LoaderUiEnum } from "@prisma/client";


export const buttonUiStyles = [
  { label: "Black", value: ButtonUiEnum.BLACK, },
  { label: "Blue", value: ButtonUiEnum.BLUE, },
  { label: "White", value: ButtonUiEnum.WHITE, },
];

export const loaderUiStyles = [
  { label: "Black", value: LoaderUiEnum.BLACK, },
  { label: "Blue", value: LoaderUiEnum.BLUE },
  { label: "White", value: LoaderUiEnum.WHITE, },
];
