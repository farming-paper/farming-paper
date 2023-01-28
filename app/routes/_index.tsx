import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { getSessionWithProfile } from "~/auth/get-session";
import { getServerSideSupabaseConfig } from "~/config";
import type { Database } from "~/supabase/generated/supabase-types";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  try {
    const { profile, session, supabaseClient } = await getSessionWithProfile({
      request,
      response,
    });
    if (!session || !profile) {
      await supabaseClient.auth.signOut();
      return redirect("/login", {
        headers: response.headers,
      });
    }
  } catch (e) {
    const { serviceRoleKey, url } = getServerSideSupabaseConfig();
    const supabaseClient = createServerClient<Database>(url, serviceRoleKey, {
      request,
      response,
    });

    await supabaseClient.auth.signOut();
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return redirect("/q/solve?status=entry");
};
