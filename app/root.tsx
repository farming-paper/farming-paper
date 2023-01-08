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
import { ConfigProvider } from "antd";
import antdResetStyles from "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { getClientSideSupabaseConfig } from "./config";
import antdStyles from "./styles/antd.css";
import tailwindStyles from "./styles/app.css";
import tailwindResetStyles from "./styles/tailwind.reset.css";
import type { Database } from "./supabase/generated/supabase-types";

export function links() {
  return [
    { rel: "stylesheet", href: tailwindResetStyles },
    { rel: "stylesheet", href: antdResetStyles },
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: antdStyles },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css",
    },
  ];
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

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.url, env.anonKey)
  );

  const fetcher = useFetcher();

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
    <html lang="ko" className="font-sans bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white pb-24 @container">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#16a34a",
            },
          }}
        >
          <Outlet context={{ supabase, session }} />
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
