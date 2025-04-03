import jwt from "jsonwebtoken";

export const getShopDomain = (request: Request): string => {
  const url = new URL(request.url);

  const shopFromUrl = url.searchParams.get("shop");
  if (shopFromUrl) {
    console.log("[getShopDomain] Found shop from URL param:", shopFromUrl);
    return shopFromUrl;
  }

  const hostParam = url.searchParams.get("host");
  if (hostParam) {
    try {
      const decoded = Buffer.from(hostParam, "base64").toString("utf-8");
      const shopFromHost = decoded.split("/")[0]; // just in case
      console.log("[getShopDomain] Decoded shop from host param:", shopFromHost);
      return shopFromHost;
    } catch (err) {
      console.error("[getShopDomain] Failed to decode host param:", err);
    }
  }

  const authorizationHeader = request.headers.get("authorization");
  if (authorizationHeader) {
    try {
      const token = authorizationHeader.replace("Bearer ", "").trim();
      const decoded = jwt.decode(token);

      if (!decoded || typeof decoded === "string") {
        throw new Error("Decoded JWT is not an object");
      }

      const dest = (decoded as any).dest;
      if (dest) {
        const cleanShop = removeHttpsPrefix(dest);
        console.log("[getShopDomain] Extracted shop from JWT:", cleanShop);
        return cleanShop;
      }

      console.warn("[getShopDomain] No 'dest' field in decoded JWT");
    } catch (err) {
      console.error("[getShopDomain] Failed to decode JWT:", err);
    }
  }

  console.error("[getShopDomain] Failed to determine shop domain");
  throw new Error("Unable to resolve shop domain from request");
};

const removeHttpsPrefix = (url: string): string => {
  return url.replace(/^https?:\/\//, "");
};
