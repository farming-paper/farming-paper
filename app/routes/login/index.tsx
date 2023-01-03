import { useOutletContext } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Button } from "antd";
import { getClientSideSupabaseConfig } from "~/config";
import type { IOutletProps } from "~/types";

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

  if (session) {
    return redirect("/", {
      // return redirect("/?status=already_logged_in", {
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

export default function Login() {
  const props = useOutletContext<IOutletProps>();

  const handleGoogleLogin = async () => {
    const { error } = await props.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error({ error });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-xl font-medium">로그인이 필요합니다.</h2>
      <Button onClick={handleGoogleLogin}>구글로 로그인</Button>
    </div>
  );
}
