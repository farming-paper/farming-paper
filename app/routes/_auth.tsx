import { Button, Link } from "@nextui-org/react";
import {
  Link as RemixLink,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { getSessionWithProfile } from "~/auth/get-session";
import { withDurationLog } from "~/util";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const { profile, session, supabaseClient } = await withDurationLog(
    "_auth_getSessionWithProfile",
    getSessionWithProfile({
      request,
      response,
    })
  );

  if (!session || !profile) {
    await supabaseClient.auth.signOut();
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return json({
    profile,
  });
};

export function ErrorBoundary() {
  const caught = useRouteError();

  if (!isRouteErrorResponse(caught)) {
    return <div>??? {JSON.stringify(caught)}</div>;
  }

  return (
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
                {/* {caught.status === 401 && "로그인 페이지로 이동합니다."} */}
              </p>
            </div>
            {caught.status === 404 && (
              <div className="flex mt-10 space-x-3 @sm:border-l @sm:border-transparent @sm:pl-6">
                <RemixLink
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 "
                >
                  홈으로 돌아가기
                </RemixLink>
                <RemixLink
                  to="/account"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  문의하기
                </RemixLink>
              </div>
            )}
            {caught.status === 401 && (
              <div className="flex mt-10 space-x-3 @sm:border-l @sm:border-transparent @sm:pl-6">
                <Button
                  as={Link}
                  href="/login"
                  color="primary"
                  variant="solid"
                >
                  로그인 페이지로 이동
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// export default AuthRouterGroup;
