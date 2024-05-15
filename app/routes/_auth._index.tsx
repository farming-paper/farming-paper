import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireAuth } from "~/auth/get-session";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await requireAuth(request);
    return redirect("/dashboard");
  } catch (e) {
    return redirect("/login");
  }
};
