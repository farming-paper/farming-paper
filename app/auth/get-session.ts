import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { LRUCache } from "lru-cache";
import { getServerSideSupabaseConfig } from "~/config";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import type { IProfile } from "~/types";
import { removeNullDeep, withDurationLog } from "~/util";

type ProfileFromDB = {
  id: number;
  public_id: string;
  desc: string | null;
  name: string | null;
  photo: string | null;
};

// @see https://stackoverflow.com/questions/72661999/how-do-i-use-in-memory-cache-in-remix-run-dev-mode
declare global {
  // eslint-disable-next-line no-var
  var __profileCache: LRUCache<string, ProfileFromDB>;
}

let profileCache: LRUCache<string, ProfileFromDB>;

const cacheOptions = {
  max: 500,
};

if (process.env.NODE_ENV === "production") {
  profileCache = new LRUCache<string, ProfileFromDB>(cacheOptions);
} else {
  if (!global.__profileCache) {
    global.__profileCache = new LRUCache<string, ProfileFromDB>(cacheOptions);
  }
  profileCache = global.__profileCache;
}

export async function getProfile(email: string): Promise<ProfileFromDB | null> {
  const cached = profileCache.get(email);
  if (cached) {
    return cached;
  }

  const db = getServerSideSupabaseClient();

  const findProfileRes = await db
    .from("profiles")
    .select("id, public_id, desc, name, photo")
    .eq("email", email)
    .is("deleted_at", null)
    .single();

  if (findProfileRes.data) {
    const profile: ProfileFromDB = findProfileRes.data;
    profileCache.set(email, findProfileRes.data);
    return profile;
  }

  profileCache.delete(email);
  return null;
}

type GetSessionWithProfileResult =
  | {
      type: "no_session" | "session_exists_but_no_user";
      client: SupabaseClient;
    }
  | {
      type: "session_exists_and_user_exists";
      session: Session;
      profile: IProfile;
      client: SupabaseClient;
    };

export async function getSessionWithProfile({
  request,
  response,
}: {
  request: Request;
  response: Response;
}): Promise<GetSessionWithProfileResult> {
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
    return {
      type: "no_session",
      client: supabaseClient,
    };
  }

  const profileFromDB = await getProfile(email);
  if (!profileFromDB) {
    return {
      type: "session_exists_but_no_user",
      client: supabaseClient,
    };
  }

  const profile = removeNullDeep({
    email,
    ...profileFromDB,
  });

  return {
    type: "session_exists_and_user_exists",
    session,
    profile,
    client: supabaseClient,
  };
}

export async function requireAuth(request: Request) {
  const response = new Response();
  const auth = await withDurationLog(
    "requireAuth_getSessionWithProfile",
    getSessionWithProfile({
      request,
      response,
    })
  );

  switch (auth.type) {
    case "no_session":
    case "session_exists_but_no_user":
      throw new Response(null, {
        status: 401,
        headers: response.headers,
      });
    case "session_exists_and_user_exists":
      return {
        session: auth.session,
        profile: auth.profile,
        client: auth.client,
      };
  }
}

// TODO: 캐시 전략을 새로 짜기.
export function deleteProfileCache({ email }: { email: string }) {
  profileCache.delete(email);
}
