import { useOutletContext } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { getClientSideSupabaseConfig } from "~/config";
import google from "~/images/logo/google.svg";
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
    <div className="bg-green-700">
      <div className="max-w-2xl px-6 py-16 mx-auto text-center @sm:py-20 @lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white @sm:text-4xl">
          <span className="block">Farming Paper</span>
        </h1>
        <h2 className="text-2xl font-medium tracking-tight text-white @sm:text-4xl">
          <span className="block">생활을 꿋꿋하게</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-green-200">
          문제를 직접 디자인하고
          <br />
          최적화된 루틴으로 출제되는 문제를
          <br />
          풀어보세요.
        </p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="inline-flex gap-1 items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-green-50 @sm:w-auto transition shadow-xl"
        >
          <span>
            <img
              aria-hidden
              src={google}
              alt="google logo"
              style={{ height: "1em" }}
            />
          </span>
          구글로 로그인
        </button>
      </div>
    </div>
  );
}
