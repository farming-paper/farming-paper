import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getServerSideSupabaseClient } from "~/supabase/client";

export async function loader({ request: _r }: LoaderArgs) {
  const db = getServerSideSupabaseClient();

  const result = await db
    .from("tags")
    .update({
      name: "hoho",
    })
    .eq("creator", 1234)
    .single();

  return json({
    result,
  });
}

export function Page() {
  const data = useLoaderData<typeof loader>();

  return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
}
