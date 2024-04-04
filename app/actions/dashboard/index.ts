import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestion } from "~/question/create";
import updateQuestionContent from "./update-question-content";

export const validator = withZod(
  z.discriminatedUnion("intent", [
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

    z.object({
      intent: z.literal("set_tag"),
      question_public_id: z.string(),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("unset_tag"),
      question_public_id: z.string(),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("create_tag"),
      name: z.string(),
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

      await prisma.tags_questions_relation.deleteMany({
        where: { questions: { public_id: data.public_id } },
      });

      return json({ data: "success", error: null });
    }
    case "create_question": {
      const row = await prisma.questions.create({
        data: {
          public_id: nanoid(),
          creator: profile.id,
          content: {
            ...createQuestion({
              type: "short_order",
            }),
          },
        },
      });
      return json({ data: row.public_id, error: null });
    }

    case "set_tag": {
      const [question, tag] = await Promise.all([
        prisma.questions.findFirst({
          where: {
            public_id: data.question_public_id,
            creator: profile.id,
            deleted_at: null,
          },
        }),
        prisma.tags.findFirst({
          where: {
            public_id: data.tag_public_id,
            creator: profile.id,
            deleted_at: null,
          },
        }),
      ]);

      if (!question) {
        return json(
          {
            data: null,
            error: {
              message: `Question not found: ${data.question_public_id}`,
            },
          },
          { status: 404 }
        );
      }

      if (!tag) {
        return json(
          {
            data: null,
            error: { message: `Tag not found: ${data.tag_public_id}` },
          },
          { status: 404 }
        );
      }

      await prisma.tags_questions_relation.create({
        data: {
          q: question.id,
          tag: tag.id,
        },
      });

      return json({ data: "success", error: null });
    }

    case "unset_tag": {
      const [question, tag] = await Promise.all([
        prisma.questions.findFirst({
          where: {
            public_id: data.question_public_id,
            creator: profile.id,
            deleted_at: null,
          },
        }),
        prisma.tags.findFirst({
          where: {
            public_id: data.tag_public_id,
            creator: profile.id,
            deleted_at: null,
          },
        }),
      ]);

      if (!question) {
        return json(
          {
            data: null,
            error: {
              message: `Question not found: ${data.question_public_id}`,
            },
          },
          { status: 404 }
        );
      }

      if (!tag) {
        return json(
          {
            data: null,
            error: { message: `Tag not found: ${data.tag_public_id}` },
          },
          { status: 404 }
        );
      }

      await prisma.tags_questions_relation.deleteMany({
        where: {
          q: question.id,
          tag: tag.id,
        },
      });

      return json({ data: "success", error: null });
    }

    case "create_tag": {
      const row = await prisma.tags.create({
        data: {
          public_id: nanoid(),
          creator: profile.id,
          name: data.name,
        },
      });
      return json({ data: { publicId: row.public_id }, error: null });
    }
  }
}
