import db from "../../db.server";
import { WalletDto } from "../dtos/identity/Wallet.dto";

export async function createWallet(data: WalletDto) {
  const wallet = await db.wallet.create({
    data: {
      wallet_address: data.wallet_address,
      linked_did: data.linked_did,
    },
  });
  return wallet;
}

export async function getWallets() {
  return await db.wallet.findMany();
}

export async function getWallet(wallet_address: string) {
  return await db.wallet.findUnique({
    where: { wallet_address },
  });
}

export async function updateWallet(
  wallet_address: string,
  data: Partial<WalletDto>
) {
  const wallet = await db.wallet.update({
    where: { wallet_address },
    data: {
      wallet_address: data.wallet_address,
      linked_did: data.linked_did,
    },
  });
  return wallet;
}

export async function deleteWallet(wallet_address: string) {
  return await db.wallet.delete({
    where: { wallet_address },
  });
}
