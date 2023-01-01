import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import Login from "./auth/Login";
import { getClientSideSupabaseConfig } from "./config";
import styles from "./styles/app.css";
import type { Database } from "./supabase/generated/supabase-types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Farming Paper",
  viewport: "width=device-width,initial-scale=1",
});

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

  return json(
    { env: getClientSideSupabaseConfig(), session },
    {
      headers: response.headers,
    }
  );
};

export default function App() {
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
    <html lang="ko" className="bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white">
        <Login session={session} supabase={supabase} />
        <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
        <Outlet context={{ supabase, session }} />
        <section
          id="bottom-navigation"
          className="fixed inset-x-0 bottom-0 left-0 right-0 z-10 block max-w-md mx-auto bg-white shadow"
        >
          <div id="tabs" className="flex justify-between">
            <a
              href="#"
              className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
            >
              <span className="block text-xs tab tab-explore">List</span>
            </a>
            <a
              href="#"
              className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
            >
              <span className="block text-xs tab tab-whishlist">Create</span>
            </a>
            <a
              href="#"
              className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
            >
              <span className="block text-xs tab tab-account">Account</span>
            </a>
          </div>
        </section>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
