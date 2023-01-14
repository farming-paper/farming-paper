import { useLoaderData, useSubmit } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { getServerSideSupabaseConfig } from "~/config";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";

export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const { serviceRoleKey, url } = getServerSideSupabaseConfig();
  const supabaseClient = createServerClient<Database>(url, serviceRoleKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  return json({
    session,
  });
}

export default function Page() {
  const { session } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const joined = useRef(false);

  useEffect(() => {
    if (!joined.current && session) {
      joined.current = true;
      submit(null, {
        action: "/join?index",
        method: "post",
      });
    }
  }, [session, submit]);

  return <div></div>;
}

export async function action({ request }: ActionArgs) {
  const response = new Response();
  const { serviceRoleKey, url } = getServerSideSupabaseConfig();
  const supabaseClient = createServerClient<Database>(url, serviceRoleKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const email = session?.user?.email;
  if (!email) {
    return redirect("/login?status=email_not_found");
  }

  const db = getServerSideSupabaseClient();

  const existingRes = await db
    .from("profiles")
    .select("email", { count: "exact" })
    .eq("email", email)
    .is("deleted_at", null);

  if (typeof existingRes.count === "number" && existingRes.count > 0) {
    return redirect("/");
  }

  const userRes = await db
    .from("profiles")
    .insert({
      email,
      public_id: nanoid(),
    })
    .single();

  if (userRes.error) {
    throw new Response(
      "프로필 생성에 실패했습니다." + userRes.error?.message ?? "",
      {
        status: 401,
      }
    );
  }

  return redirect("/");
}
