import { Session } from "@shopify/shopify-api";
import { authenticate } from "~/shopify.server";
import { getShopDomain } from "./getShopDomain";

export const authenticateWithFallback = {
  async admin(request: Request) {
    const result = await authenticate.admin(request);

    if (!result.session?.shop) {
      const fallbackShop = getShopDomain(request);
      console.warn("[auth fallback] Injected shop from fallback:", fallbackShop);

      result.session = new Session({
        id: `offline_${fallbackShop}`,
        shop: fallbackShop,
        state: "injected",
        isOnline: false,
      });
    }

    return result;
  },
};
