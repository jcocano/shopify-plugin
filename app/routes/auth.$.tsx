import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, redirect: authRedirect } = await authenticate.admin(request);
  
  // If we get a redirect, return it immediately
  if (authRedirect) {
    return authRedirect;
  }
  
  // If we have admin access, redirect to the app
  if (admin) {
    return redirect("/app");
  }
  
  // If we get here, something went wrong with authentication
  return redirect("/auth/login");
};
