import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { Analytics } from "@vercel/analytics/react";
import { ConfigProvider } from "antd";
import antdResetStyles from "antd/dist/reset.css";
import { useEffect, useState } from "react";
import GlobalLoading from "./common/components/GlobalLoading";
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
  viewport: "width=device-width,user-scalable=no",
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

  const authChangedFetcher = useFetcher();

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
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
  }, [authChangedFetcher, serverAccessToken, supabase]);

  return (
    <html lang="ko" className="font-sans bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white pb-16 @container">
        <GlobalLoading />
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#16a34a",
              fontSize: 16,
              controlHeight: 40,
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

// export function CatchBoundary() {
//   const caught = useCatch();

//   return (
//     <html lang="ko" className="font-sans bg-gray-50">
//       <head>
//         <Meta />
//         <Links />
//       </head>
//       <body className="relative max-w-md min-h-[100vh] mx-auto bg-white pb-16 @container">
//         <GlobalLoading />
//         <ConfigProvider
//           theme={{
//             token: {
//               colorPrimary: "#16a34a",
//               fontSize: 16,
//               controlHeight: 40,
//             },
//           }}
//         >
//           <div className="p-4">
//             {caught.status === 404 ? (
//               <h1 className="my-2 text-xl font-medium">
//                 페이지를 찾을 수 없습니다.
//               </h1>
//             ) : (
//               <h1></h1>
//             )}
//           </div>
//         </ConfigProvider>
//         <ScrollRestoration />
//         <Scripts />
//         <LiveReload />
//         <Analytics />
//       </body>
//     </html>
//   );
// }

export function CatchBoundary() {
  const caught = useCatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (caught.status === 401) {
      navigate("/login");
    }
  }, [caught.status, navigate]);

  return (
    <html lang="ko" className="font-sans bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white pb-16 @container">
        <GlobalLoading />
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#16a34a",
              fontSize: 16,
              controlHeight: 40,
            },
          }}
        >
          <div className="min-h-full px-6 py-16 bg-white @sm:py-24 @md:grid @md:place-items-center @lg:px-8">
            <div className="mx-auto max-w-max">
              <main className="@sm:flex">
                <p className="text-4xl font-bold tracking-tight text-green-600 @sm:text-5xl">
                  {caught.status}
                </p>
                <div className="@sm:ml-6">
                  <div className="@sm:border-l @sm:border-gray-200 @sm:pl-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 @sm:text-5xl">
                      {caught.status === 404 && "페이지를 찾을 수 없습니다."}
                      {caught.status === 401 && "로그인 정보가 없습니다."}
                    </h1>

                    <p className="mt-1 text-base text-gray-500">
                      {caught.status === 404 &&
                        "URL이 올바른지 확인하고 다시 시도해주세요."}
                      {caught.status === 401 && "로그인 페이지로 이동합니다."}
                    </p>
                  </div>
                  {caught.status === 404 && (
                    <div className="flex mt-10 space-x-3 @sm:border-l @sm:border-transparent @sm:pl-6">
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 "
                      >
                        홈으로 돌아가기
                      </Link>
                      <Link
                        to="/account"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        문의하기
                      </Link>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
