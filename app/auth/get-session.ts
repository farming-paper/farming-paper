import { createServerClient } from "@supabase/auth-helpers-remix";
import { getServerSideSupabaseConfig } from "~/config";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import type { IProfile } from "~/types";
import { removeNullDeep } from "~/util";

export async function getSessionWithProfile({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const { serviceRoleKey, url } = getServerSideSupabaseConfig();
  const supabaseClient = createServerClient<Database>(url, serviceRoleKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const db = getServerSideSupabaseClient();

  const email = session?.user?.email;
  if (!email) {
    // throw redirect("/login");
    throw new Response("No Eamil in session", {
      status: 401,
    });
  }

  const findProfileRes = await db
    .from("profiles")
    .select("id, public_id, desc, name, photo")
    .eq("email", session?.user?.email)
    .is("deleted_at", null)
    .single();

  let profile: IProfile;

  // 유저가 없는 경우 로그아웃하고 로그인 페이지로 이동
  if (!findProfileRes.data) {
    // throw redirect("/login");
    throw new Response("No Profile", {
      status: 401,
    });
  }
  // 유저가 존재하는 경우
  else {
    profile = removeNullDeep({
      email,
      id: findProfileRes.data.id,
      public_id: findProfileRes.data.public_id,
      desc: findProfileRes.data.desc,
      name: findProfileRes.data.name,
      photo: findProfileRes.data.photo,
    });
  }

  return {
    session,
    profile,
    supabaseClient,
  };
}
