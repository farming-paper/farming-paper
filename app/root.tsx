import { cssBundleHref } from "@remix-run/css-bundle";
import type { LoaderFunctionArgs } from "@remix-run/node";
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
  useNavigate,
} from "@remix-run/react";
import { Slide, ToastContainer } from "react-toastify";

import { NextUIProvider } from "@nextui-org/react";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import reatToastifyMinCss from "react-toastify/dist/ReactToastify.min.css";
import { getClientSideSupabaseConfig } from "./config";
import tailwindStyles from "./styles/app.css";
import tailwindCss from "./styles/pretendard.css";
import type { Database } from "./supabase/generated/supabase-types";
import { withDurationLog } from "./util";

export function links() {
  return [
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: reatToastifyMinCss },
    { rel: "stylesheet", href: tailwindCss },
    {
      rel: "stylesheet",
      href: "//fonts.googleapis.com/css?family=Ubuntu+Mono",
    },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
}

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

export default function Root() {
  const { env, session } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
    <html lang="ko" className="font-sans">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="text-foreground bg-background light">
        <NextUIProvider navigate={navigate}>
          <Outlet context={{ supabase, session }} />
        </NextUIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
        <ToastContainer
          autoClose={2000}
          hideProgressBar
          position="top-center"
          transition={Slide}
        />
      </body>
    </html>
  );
}
