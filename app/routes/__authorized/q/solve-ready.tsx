import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getSessionWithProfile } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { ITag } from "~/types";
import { removeNullDeep } from "~/util";

export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();
  const tagsRes = await db
    .from("tags")
    .select("desc, name, public_id, id", { count: "estimated" })
    .order("updated_at", { ascending: false })
    .neq("deleted_at", null)
    .eq("creator", profile.id);

  if (tagsRes.error) {
    throw new Response(tagsRes.error.message, {
      status: 500,
    });
  }

  return json({
    tags: tagsRes.data.map((t): ITag => {
      return removeNullDeep({
        id: t.id,
        desc: t.desc,
        name: t.name || "",
        publicId: t.public_id,
      });
    }),
  });
}

export default function Page() {
  return <></>;
}
