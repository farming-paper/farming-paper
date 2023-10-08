import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import { getSessionWithProfile } from "~/auth/get-session";
import type { Question } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import type { ITag } from "~/types";
import { typedFetcher } from "~/util";

const { createArgs, getArgsFromRequest, useFetcher } = typedFetcher<
  typeof action,
  {
    question: Question;
    tags: ITag[];
  }
>();

export const createCreateQuestionArgs = createArgs;

export const useCreateQuestionFetcher = useFetcher;

export async function action({ request }: ActionFunctionArgs) {
  const { question, tags } = await getArgsFromRequest(request);

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

  const db = getServerSideSupabaseClient();

  const inserted = await db
    .from("questions")
    .insert({
      creator: profile.id,
      public_id: nanoid(),
      content: question as unknown as Json,
    })
    .select("*")
    .single();

  if (!inserted.data) {
    return json({
      data: null,
      error: "inserted.data is null",
    });
  }

  // get tags each id
  const tagsRes = await db
    .from("tags")
    .select("id")
    .in(
      "public_id",
      tags.map((t) => t.publicId)
    );

  if (tagsRes.error) {
    return json({
      data: null,
      error: tagsRes.error.message,
    });
  }

  const tagRelationRes = await db
    .from("tags_questions_relation")
    .upsert(
      tagsRes.data.map((t) => ({
        q: inserted.data.id,
        tag: t.id,
      }))
    )
    .select("*");

  if (tagRelationRes.error) {
    return json({
      data: null,
      error: tagRelationRes.error.message,
    });
  }

  return json({
    data: inserted.data,
    error: null,
  });
}
