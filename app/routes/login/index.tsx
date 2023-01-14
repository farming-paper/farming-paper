import { useOutletContext, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { message } from "antd";
import { Carrot, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const [urlSearchParams] = useSearchParams();
  const statusMessaged = useRef(false);

  useEffect(() => {
    if (statusMessaged.current) {
      return;
    }
    const status = urlSearchParams.get("status");

    switch (status) {
      case "logged_out":
        message.success("성공적으로 로그아웃되었습니다.");
        break;
      case "deleted_account":
        message.success("성공적으로 계정이 삭제되었습니다.");
        break;
      default:
        break;
    }

    statusMessaged.current = true;
  }, [urlSearchParams]);

  const handleGoogleLogin = async () => {
    const redirectTo = new URL(window.location.href);
    redirectTo.pathname = "/join";
    const { error } = await props.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.href,
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
          className="inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-green-50 @sm:w-auto transition shadow-xl"
        >
          <span>
            <img
              aria-hidden
              src={google}
              alt="google logo"
              style={{ height: "1em" }}
            />
          </span>
          <span className="flex-1">구글로 로그인</span>
        </button>
        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-1 my-16 border-0 rounded bg-white/30 dark:bg-green-700" />
          <div className="absolute px-4 text-white -translate-x-1/2 bg-green-700 left-1/2 dark:bg-green-900">
            <Carrot />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://tally.so/r/w8NWlk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-900 transition bg-green-400 border border-transparent rounded-md shadow-xl hover:bg-green-300"
          >
            <span style={{ marginInlineStart: 0 }}>건의 및 문의하기</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
          <a
            href="https://springfall.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-900 transition bg-green-400 border border-transparent rounded-md shadow-xl hover:bg-green-300"
          >
            <span style={{ marginInlineStart: 0 }}>개발자 블로그</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
          <a
            href="https://github.com/farming-paper/farming-paper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-900 transition bg-green-400 border border-transparent rounded-md shadow-xl hover:bg-green-300"
          >
            <span style={{ marginInlineStart: 0 }}>Github</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
