import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import dayjs from "dayjs";
import { getSessionWithProfile } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { typedFetcher } from "~/util";

const { createArgs, useFetcher } = typedFetcher<typeof action>();

export const useDeleteAccountFetcher = useFetcher;

export const createDeleteAccountArgs = createArgs;

async function removeTagsAndTagRelations(profileId: number) {
  const db = getServerSideSupabaseClient();

  const removeTagsRes = await db
    .from("tags")
    .update({
      deleted_at: dayjs().toISOString(),
    })
    .eq("creator", profileId)
    .select("id");

  if (removeTagsRes.error) {
    return {
      data: null,
      error: removeTagsRes.error.message,
    };
  }

  const removedTagIds = removeTagsRes.data.map((tag) => tag.id);

  const removeRelationsRes = await db
    .from("tags_questions_relation")
    .delete()
    .in("tag", removedTagIds);

  if (removeRelationsRes.error) {
    return {
      data: null,
      error: removeRelationsRes.error.message,
    };
  }

  return {
    data: "success",
    error: null,
  } as const;
}

async function removeQuestions(profileId: number) {
  const db = getServerSideSupabaseClient();

  const removeQuestionsRes = await db
    .from("questions")
    .update({
      deleted_at: dayjs().toISOString(),
    })
    .eq("creator", profileId);

  if (removeQuestionsRes.error) {
    return {
      data: null,
      error: removeQuestionsRes.error.message,
    };
  }

  return {
    data: "success",
    error: null,
  } as const;
}

async function removeProfile(profileId: number) {
  const db = getServerSideSupabaseClient();

  const rmProfileRes = await db
    .from("profiles")
    .update({
      deleted_at: dayjs().toISOString(),
    })
    .eq("id", profileId);

  if (rmProfileRes.error) {
    return {
      data: null,
      error: rmProfileRes.error.message,
    };
  }

  return {
    data: "success",
    error: null,
  } as const;
}

export async function action({ request }: ActionArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ response, request });

  const removeTagsAndTagRelationsRes = await Promise.all([
    removeTagsAndTagRelations(profile.id),
    removeQuestions(profile.id),
    removeProfile(profile.id),
  ]);

  if (removeTagsAndTagRelationsRes.some((res) => res.error)) {
    return json({
      data: null,
      error: removeTagsAndTagRelationsRes.map((res) => res.error).join(", "),
    });
  }

  return json({
    data: "success" as const,
    error: null,
  });
}
