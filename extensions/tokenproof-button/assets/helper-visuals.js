export function getButtonClass(buttonEnum) {
  switch (buttonEnum) {
    case 'BLUE':
      return 'buttonBlue';
    case 'BLACK':
      return 'buttonBlack';
    case 'WHITE':
      return 'buttonWhite';
    default:
      return 'buttonBlue';
  }
}

export function getLoaderClass(loaderEnum) {
  switch (loaderEnum) {
    case 'BLUE':
      return 'loaderBlue';
    case 'BLACK':
      return 'loaderBlack';
    case 'WHITE':
      return 'loaderWhite';
    default:
      return 'loaderBlue';
  }
}
