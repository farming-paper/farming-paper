import { useOutletContext, useSearchParams } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { message } from "antd";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import { getClientSideSupabaseConfig } from "~/config";
import google from "~/images/logo/google.svg";
import type { IOutletProps } from "~/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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
        message.success("계정이 성공적으로 삭제되었습니다.");
        break;
      default:
        break;
    }

    statusMessaged.current = true;
  }, [urlSearchParams]);

  const handleGoogleLogin = async () => {
    const redirectTo = new URL(window.location.href.split("?")[0] as string);
    redirectTo.pathname = "/auth/callback";

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
      <div className="max-w-2xl px-6 py-16 mx-auto text-center">
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-white">
          <span className="block">Farming Paper</span>
        </h1>
        <p className="mb-12 text-2xl font-semibold leading-tight text-green-200">
          분야를 가리지 않는,
          <br />
          극한의 <span className="text-white">셀프 암기 학습</span> 도구
        </p>
        <div className="my-20">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-green-50 @sm:w-auto transition shadow-xl"
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
        </div>
        {/* <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-1 my-16 border-0 rounded bg-white/30 dark:bg-green-700" />
          <div className="absolute px-4 text-green-200 -translate-x-1/2 bg-green-700 left-1/2 dark:bg-green-900">
            <Carrot />
          </div>
        </div> */}
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
