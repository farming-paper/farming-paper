import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { message } from "antd";
import { useEffect, useRef } from "react";
import BottomNav from "~/components/BottomNav";
import { getClientSideSupabaseConfig } from "~/config";
import type { IOutletProps } from "~/types";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const { anonKey, url: supabaseUrl } = getClientSideSupabaseConfig();
  const supabase = createServerClient(supabaseUrl, anonKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  if (!session) {
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return json({
    isAlreadyLoggedIn: status === "already_logged_in",
  });
};

const Authorized = () => {
  const data = useLoaderData<typeof loader>();
  const messaged = useRef(false);
  const context = useOutletContext<IOutletProps>();

  useEffect(() => {
    if (data.isAlreadyLoggedIn && !messaged.current) {
      message.info("이미 로그인되어 있습니다.");
      messaged.current = true;
    }
  }, [data.isAlreadyLoggedIn]);

  return (
    <>
      <Outlet context={context} />
      <BottomNav />
    </>
  );
};

export default Authorized;
