import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("return_to") || "/app/campaigns"; // default fallback

  const { session, redirect } = await authenticate.admin(request);

  if (!session) {
    return redirect;
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: returnTo,
    },
  });
};
