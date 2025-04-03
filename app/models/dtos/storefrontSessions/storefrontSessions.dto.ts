import type { StorefrontHoldingsDto } from "./storefrontHoldings.dto";
import type { StorefrontSessionsEnum } from "./storefrontSessions.enum";

export interface UserSessionsDto {
  shop: string;
  app_id: string;
  account: string;
  nonce: string;
  client_ip: string;
  status: StorefrontSessionsEnum;
  did: string;
  shopify_session_id: string;
  storefrontHoldings?: StorefrontHoldingsDto[];
}

export function createUserSessionsDto(
  data?: Partial<UserSessionsDto>
): UserSessionsDto {
  return {
    shop: data?.shop || "",
    app_id: data?.app_id || "",
    account: data?.account || "",
    nonce: data?.nonce || "",
    client_ip: data?.client_ip || "",
    status: data?.status || ("PENDING" as StorefrontSessionsEnum),
    did: data?.did || "",
    shopify_session_id: data?.shopify_session_id || "",
    storefrontHoldings: data?.storefrontHoldings || [],
  };
}
