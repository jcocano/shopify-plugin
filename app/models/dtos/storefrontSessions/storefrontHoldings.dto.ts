export interface StorefrontHoldingsDto {
  holdings?: string[];
  contract?: string;
}

export function createStorefrontHoldingsDto(
  data?: Partial<StorefrontHoldingsDto>
): StorefrontHoldingsDto {
  return {
    holdings: data?.holdings,
    contract: data?.contract,
  };
}
