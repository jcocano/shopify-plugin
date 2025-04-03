import crypto from "crypto";

export function verifyShopifyRequest(url: URL): boolean {
  const hmac = url.searchParams.get("hmac");
  if (!hmac) return false;

  const message = Array.from(url.searchParams.entries())
    .filter(([key]) => key !== "hmac")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error("SHOPIFY_API_SECRET no está definido en las variables de entorno.");
    throw new Error("Server misconfiguration");
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
  } catch {
    return false;
  }
}
