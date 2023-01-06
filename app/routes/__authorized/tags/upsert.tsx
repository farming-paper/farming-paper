import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import { getSessionWithProfile } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { ITag, PartialDeep } from "~/types";
import { getFormdataFromRequest, removeNullDeep } from "~/util";

export async function action({ request }: ActionArgs) {
  const response = new Response();
  const [tags, { profile }] = await Promise.all([
    getFormdataFromRequest<PartialDeep<ITag>[]>({
      request,
      keyName: "tags",
    }),
    getSessionWithProfile({ request, response }),
  ]);

  const db = getServerSideSupabaseClient();

  async function upsertTag(tag: PartialDeep<ITag>) {
    const updateTagRes = await db
      .from("tags")
      .update({ name: tag.name, desc: tag.desc })
      .eq("public_id", tag.publicId)
      .eq("creator", profile.id)
      .select("*")
      .single();

    if (updateTagRes.data) {
      const updatedTag: ITag = removeNullDeep({
        publicId: updateTagRes.data.public_id,
        desc: updateTagRes.data.desc,
        name: updateTagRes.data.name || "",
      });
      return updatedTag;
    }

    // 태그를 찾을 수 없는 경우
    else {
      const createdRes = await db
        .from("tags")
        .insert({
          creator: profile.id,
          public_id: nanoid(),
          name: tag.name,
          desc: tag.desc,
        })
        .select("public_id, desc, name")
        .single();
      if (createdRes.error) {
        throw new Response(createdRes.error.message, {
          status: 500,
        });
      }
      const newTag: ITag = removeNullDeep({
        publicId: createdRes.data.public_id,
        desc: createdRes.data.desc,
        name: createdRes.data.name || "",
      });

      return newTag;
    }
  }

  const resultTags = await Promise.all(tags.map((tag) => upsertTag(tag)));
  return json({
    tags: resultTags,
  });
}
