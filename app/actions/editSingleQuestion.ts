import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import type { IProfile } from "~/types";
import { bigintToNumber } from "~/util";

export type DeleteQuestionAction = {
  intent: "delete_question";
  public_id: string;
};

export type EditQuestionAction = {
  intent: "edit_question";
  public_id: string;
  content: string;
};

export const actionValidator = withZod(
  /** TODO: fix to switch later. @see https://github.com/colinhacks/zod/issues/2106 */
  z.discriminatedUnion("intent", [
    z.object({ intent: z.literal("upsert_tag"), name: z.string() }),
    z.object({
      intent: z.literal("edit_question"),
      public_id: z.string(),
      content: z.string(),
    }),
    z.object({
      intent: z.literal("delete_question"),
      public_id: z.string(),
    }),
  ])
);

async function removeSingleQuestion({
  profile,
  action,
}: {
  profile: IProfile;
  action: DeleteQuestionAction;
}) {
  const { public_id } = action;

  const question = await prisma.questions.findFirst({
    where: {
      public_id,
      creator: profile.id,
    },
  });

  if (!question) {
    return json({ data: null, error: "Not Found" }, { status: 404 });
  }

  await prisma.questions.update({
    where: { public_id },
    data: { deleted_at: new Date() },
  });

  return redirect("/q/list?deleted=1");
}

async function editSingleQuestion({
  profile,
  action,
  tagPublicIds,
}: {
  profile: IProfile;
  action: EditQuestionAction;
  tagPublicIds: string[];
}) {
  const updatedQuestion = await prisma.questions.update({
    where: {
      public_id: action.public_id,
      creator: profile.id,
    },
    data: {
      content: JSON.parse(action.content),
    },
  });

  // 현재 문제와 태그의 관계를 가져옵니다.
  const [existingTagsRes, editingDataTagsRes] = await Promise.all([
    prisma.tags_questions_relation.findMany({
      where: { q: updatedQuestion.id },
      include: { tags: true },
    }),
    prisma.tags.findMany({
      where: { public_id: { in: tagPublicIds }, deleted_at: null },
    }),
  ]);

  const existingTags = existingTagsRes.map((t) => t.tags);
  const editingDataTags = editingDataTagsRes;

  // 원래 있는 태그 중 새로운 태그에 없는 태그들을 삭제합니다. (순수하게 삭제할 태그만 남깁니다.)
  const removingTags = existingTags.filter(
    (existingTag) =>
      !editingDataTags.some(
        (newTag) => newTag.public_id === existingTag.public_id
      )
  );

  // 새로운 태그 중 원래 있는 태그에 없는 태그들을 삭제합니다. (순수하게 추가할 태그만 남깁니다.)
  const addingTags = editingDataTags.filter(
    (newTag) => !existingTags.some((tag) => tag.public_id === newTag.public_id)
  );

  await Promise.all([
    prisma.tags_questions_relation.deleteMany({
      where: {
        tag: { in: removingTags.map((t) => t.id) },
        q: updatedQuestion.id,
      },
    }),

    prisma.tags_questions_relation.createMany({
      data: addingTags.map((addingTag) => ({
        q: updatedQuestion.id,
        tag: addingTag.id,
      })),
    }),
  ] as const);

  return json({
    data: {
      ...updatedQuestion,
      id: bigintToNumber(updatedQuestion.id),
      creator: bigintToNumber(updatedQuestion.creator),
    },
    error: null,
  });
}

async function updateSingleQuestion({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const action = await actionValidator.validate(formData);

  if (action.error) {
    return json(
      {
        data: null,
        error: action.error,
      },
      { status: 400 }
    );
  }

  if (action.data.intent === "upsert_tag") {
    // ...
    return json(
      {
        data: null,
        error: "Not Implemented",
      },
      { status: 501 }
    );
  }

  const tagPublicIds = formData
    .getAll("tag_public_id")
    .map((v) => v.toString());

  switch (action.data.intent) {
    case "delete_question":
      return removeSingleQuestion({ profile, action: action.data });
    case "edit_question":
      return editSingleQuestion({ profile, action: action.data, tagPublicIds });
  }
}

export default updateSingleQuestion;
