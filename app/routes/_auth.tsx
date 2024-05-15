import { Button, Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import {
  Link as RemixLink,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { defaultMeta } from "~/meta";

export const meta: MetaFunction = () => {
  return [...defaultMeta, { title: "Login | Farming Paper" }];
};

export function ErrorBoundary() {
  const caught = useRouteError();

  if (!isRouteErrorResponse(caught)) {
    return (
      <div>
        <p>unknown error</p>
        <pre>{JSON.stringify(caught, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-max">
      <main>
        <p className="text-4xl font-bold tracking-tight text-green-600">
          {caught.status}
        </p>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
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
          <div className="flex mt-10 space-x-3">
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
          <div className="flex mt-10 space-x-3">
            <Button as={Link} href="/login" color="primary" variant="solid">
              로그인 페이지로 이동
            </Button>
          </div>
        )}
        <pre className="mt-5 text-sm text-gray-400">
          error: {JSON.stringify(caught.data, null, 2)}
        </pre>
      </main>
    </div>
  );
}
