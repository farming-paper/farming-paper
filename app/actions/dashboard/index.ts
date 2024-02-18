import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import updateQuestionContent from "./update-question-content";

export const validator = withZod(
  z.discriminatedUnion("intent", [
    z.object({
      intent: z.literal("add_existing_tag_to_question"),
      question_public_id: z.string(),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("add_new_tag_to_question"),
      question_public_id: z.string(),
      name: z.string(),
    }),

    z.object({
      intent: z.literal("delete_tag_from_question"),
      question_public_id: z.string(),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("remove_question"),
      public_id: z.string(),
    }),

    z.object({
      intent: z.literal("create_question"),
    }),

    z.object({
      intent: z.literal("update_question_content"),
      public_id: z.string(),
      content: z.string(),
    }),
  ])
);

export default async function dashboardAction({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const action = await validator.validate(formData);

  if (action.error) {
    return json(
      {
        data: null,
        error: action.error,
      },
      { status: 400 }
    );
  }

  const data = action.data;

  switch (data.intent) {
    case "update_question_content":
      return updateQuestionContent({ ...data, creator: profile.id });
    case "remove_question": {
      await prisma.questions.update({
        where: {
          public_id: data.public_id,
          creator: profile.id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      return json({ data: "success", error: null });
    }
    case "add_existing_tag_to_question":
    case "add_new_tag_to_question":
    case "delete_tag_from_question":
    case "create_question":
      return json({ data: null, error: "Not Implemented" }, { status: 501 });
  }
}
