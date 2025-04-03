export const LoaderUiEnum = {
  BLACK: 'BLACK',
  BLUE: 'BLUE',
  WHITE: 'WHITE',
} as const;

export type LoaderUiEnum = typeof LoaderUiEnum[keyof typeof LoaderUiEnum];

export const ButtonUiEnum = {
  BLACK: 'BLACK',
  BLUE: 'BLUE',
  WHITE: 'WHITE',
} as const;

export type ButtonUiEnum = typeof ButtonUiEnum[keyof typeof ButtonUiEnum];
