import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { requireAuth } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { typedFetcher } from "~/util";

const { createArgs, getArgsFromRequest, useFetcher } = typedFetcher<
  typeof action,
  { publicId: string }
>();

export const createDeletionQuestionArgs = createArgs;

export const getDeletionQuestionArgsFromRequest = getArgsFromRequest;

export const useDeletionQuestionFetcher = useFetcher;

export async function action({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const { publicId } = await getDeletionQuestionArgsFromRequest(request);
  const db = getServerSideSupabaseClient();

  const deletedRes = await db
    .from("questions")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("public_id", publicId)
    .eq("creator", profile.id)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (!deletedRes.data) {
    return json({
      data: null,
      error: deletedRes.error?.message || "",
    });
  }

  const deletedQuestionId = deletedRes.data.id;

  const deletedRelationsRes = await db
    .from("tags_questions_relation")
    .delete()
    .eq("q", deletedQuestionId)
    .select("*");

  if (deletedRelationsRes.error) {
    return json({
      data: null,
      error: deletedRelationsRes.error?.message || "",
    });
  }

  return redirect("/q/list", { status: 303 });

  // const deletedQuestion: Question = createQuestion(
  //   deletedRes.data.content as unknown as PartialDeep<Question>
  // );

  // return json({
  //   data: deletedQuestion,
  //   error: null,
  // });
}
