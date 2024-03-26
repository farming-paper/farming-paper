import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import { requireAuth } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { createTag } from "~/tag/create";
import type { ITag } from "~/types";
import { removeNullDeep, typedFetcher } from "~/util";

const { createArgs, getArgsFromRequest, useFetcher } = typedFetcher<
  typeof action,
  { name: string; desc?: string }
>();

export const createUpsertTagArgs = createArgs;

export const useUpsertTagFetcher = useFetcher;

export async function action({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const { name, desc } = await getArgsFromRequest(request);

  const db = getServerSideSupabaseClient();

  const creating = createTag({ name });

  const updateTagRes = await db
    .from("tags")
    .update({ name: creating.name, desc: creating.desc })
    .eq("public_id", creating.publicId)
    .eq("creator", profile.id)
    .select("*")
    .single();

  if (updateTagRes.data) {
    const updatedTag: ITag = removeNullDeep({
      id: updateTagRes.data.id,
      publicId: updateTagRes.data.public_id,
      desc: updateTagRes.data.desc,
      name: updateTagRes.data.name || "",
    });

    return json({ data: updatedTag, error: null });
  }

  // 태그를 찾을 수 없는 경우
  else {
    const createdRes = await db
      .from("tags")
      .insert({
        creator: profile.id,
        public_id: nanoid(),
        name,
        desc,
      })
      .select("public_id, desc, name, id")
      .single();

    if (createdRes.error) {
      return json({
        data: null,
        error: {
          postgresError: createdRes.error,
          name: creating.name,
        },
      });
    }

    const newTag: ITag = removeNullDeep({
      id: createdRes.data.id,
      publicId: createdRes.data.public_id,
      desc: createdRes.data.desc,
      name: createdRes.data.name || "",
    });

    return json({ data: newTag, error: null });
  }
}
