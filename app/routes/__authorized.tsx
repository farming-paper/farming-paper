import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";
import BottomNav from "~/components/BottomNav";
import { getClientSideSupabaseConfig } from "~/config";
import type { Database } from "~/supabase/generated/supabase-types";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const { anonKey, url } = getClientSideSupabaseConfig();
  const supabase = createServerClient(url, anonKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("response", response);

  if (!session) {
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return json(
    { env: getClientSideSupabaseConfig(), session },
    {
      headers: response.headers,
    }
  );
};

const Authorized = () => {
  const { env, session } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.url, env.anonKey)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        fetcher.submit(null, {
          method: "post",
          action: "/handle-supabase-auth",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, fetcher]);

  return (
    <>
      <Outlet context={{ supabase, session }} />
      <BottomNav />
    </>
  );
};

export default Authorized;
