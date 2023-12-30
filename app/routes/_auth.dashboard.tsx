import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";

export const meta: MetaFunction = () => {
  return [{ title: "대시보드 | Farming Paper" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);
  const url = new URL(request.url);

  const queryValidation = z
    .union([z.null(), z.string()])
    .optional()
    .safeParse(url.searchParams.get("query"));

  if (!queryValidation.success) {
    url.searchParams.delete("query");
    throw new Response(null, { status: 301, headers: { Location: url.href } });
  }

  const pageValidation = z
    .number()
    .safeParse(Number(url.searchParams.get("page")));

  if (!pageValidation.success) {
    url.searchParams.set("page", "1");
    throw new Response(null, { status: 301, headers: { Location: url.href } });
  }

  return json({ query: "123", profile });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <DefaultLayout sidebarTop={<SideMenuV2 />}>
      <div>
        <h1>Welcome to the Auth Dashboard!</h1>
        <pre>{JSON.stringify(data)}</pre>
        <p>User:</p>
      </div>
    </DefaultLayout>
  );
}
