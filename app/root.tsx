import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
import { App, ConfigProvider } from "antd";
import antdResetStyles from "antd/dist/reset.css";
import type { ThemeConfig } from "antd/es/config-provider/context";
import { useEffect, useState } from "react";
import GlobalLoading from "./common/components/GlobalLoading";
import { getClientSideSupabaseConfig } from "./config";
import antdStyles from "./styles/antd.css";
import tailwindStyles from "./styles/app.css";
import tailwindResetStyles from "./styles/tailwind.reset.css";
import type { Database } from "./supabase/generated/supabase-types";
import { withDurationLog } from "./util";

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

export const meta: MetaFunction = () => [
  {
    title: "Farming Paper",
  },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const { anonKey, url } = getClientSideSupabaseConfig();
  const supabase = createServerClient(url, anonKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await withDurationLog("root_getSession", supabase.auth.getSession());

  return json(
    { env: getClientSideSupabaseConfig(), session },
    {
      headers: response.headers,
    }
  );
};

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#16a34a",
    fontSize: 16,
    controlHeight: 40,
  },
};

export default function Root() {
  const { env, session } = useLoaderData<typeof loader>();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.url, env.anonKey)
  );

  const authChangedFetcher = useFetcher();

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session?.access_token !== serverAccessToken &&
        authChangedFetcher.state === "idle"
      ) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        authChangedFetcher.submit(null, {
          method: "post",
          action: "/handle-supabase-auth",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, authChangedFetcher]);

  return (
    <html lang="ko" className="font-sans bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white pb-16 @container">
        <GlobalLoading />
        <ConfigProvider theme={theme}>
          <App>
            <Outlet context={{ supabase, session }} />
          </App>
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
