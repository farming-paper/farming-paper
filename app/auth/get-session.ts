import { createServerClient } from "@supabase/auth-helpers-remix";
import { nanoid } from "nanoid";
import { getServerSideSupabaseConfig } from "~/config";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import type { IProfile } from "~/types";
import { removeNullDeep } from "~/util";

export async function getSession({
  request,
  response,
}: {
  response: Response;
  request: Request;
}) {
  const { serviceRoleKey, url } = getServerSideSupabaseConfig();
  const supabase = createServerClient<Database>(url, serviceRoleKey, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getSessionWithProfile({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const session = await getSession({ request, response });
  const db = getServerSideSupabaseClient();

  const email = session?.user?.email;
  if (!email) {
    throw new Error("no email in session");
  }

  const findProfileRes = await db
    .from("profiles")
    .select("id, public_id, desc, name, photo")
    .eq("email", session?.user?.email)
    .is("deleted_at", null)
    .single();

  let profile: IProfile;

  // 유저가 없는 경우
  if (!findProfileRes.data) {
    // eslint-disable-next-line no-console
    console.log("프로필에 존재하지 않는 유저입니다. 새 프로필을 생성합니다...");
    const userRes = await db
      .from("profiles")
      .insert({
        email,
        public_id: nanoid(),
      })
      .select("id, public_id, desc, name, photo")
      .single();
    if (!userRes.data) {
      throw new Error(
        "프로필 생성에 실패했습니다." + userRes.error?.message ?? ""
      );
    }

    profile = removeNullDeep({
      email,
      id: userRes.data.id,
      public_id: userRes.data.public_id,
      desc: userRes.data.desc,
      name: userRes.data.name,
      photo: userRes.data.photo,
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
  };
}
