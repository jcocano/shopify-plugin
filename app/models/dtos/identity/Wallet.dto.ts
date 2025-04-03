export interface WalletDto {
  wallet_address: string;
  linked_did: string;
}

export function createWalletDto(data?: Partial<WalletDto>): WalletDto {
  return {
    wallet_address: data?.wallet_address || "",
    linked_did: data?.linked_did || "",
  };
}
