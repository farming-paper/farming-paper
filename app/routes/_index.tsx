import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getSessionWithProfile } from "~/auth/get-session";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  try {
    const { profile, session, supabaseClient } = await getSessionWithProfile({
      request,
      response,
    });
    if (!session || !profile) {
      supabaseClient.auth.signOut();
      return redirect("/login", {
        headers: response.headers,
      });
    }
  } catch (e) {
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return redirect("/q/solve");
};
