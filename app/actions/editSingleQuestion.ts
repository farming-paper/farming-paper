import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";

export const schema = withZod(
  z.discriminatedUnion("intent", [
    z.object({
      intent: z.literal("remove_question"),
    }),

    z.object({
      intent: z.literal("update_question_content"),
      content: z.string(),
    }),

    z.object({
      intent: z.literal("set_tag"),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("unset_tag"),
      tag_public_id: z.string(),
    }),

    z.object({
      intent: z.literal("create_tag"),
      name: z.string(),
    }),
  ])
);

export const searchParamsSchema = z.object({
  tags: z
    .string()
    .optional()
    .transform((v) => v?.split(",")),
  back: z.literal("solve"),
});

export default async function editSingleQuestionAction({
  request,
  params,
}: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);

  const { publicId: questionPublicId } = params;
  if (!questionPublicId) {
    return json({ data: null, error: "Not Found" }, { status: 404 });
  }

  const searchParamsValidation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );
  if (!searchParamsValidation.success) {
    return json(
      {
        data: null,
        error: searchParamsValidation.error,
      },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const action = await schema.validate(formData);

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
    case "update_question_content": {
      await prisma.questions.update({
        where: {
          public_id: questionPublicId,
          creator: profile.id,
          deleted_at: null,
        },
        data: {
          content: JSON.parse(data.content),
          updated_at: new Date(),
        },
      });

      return redirect(
        `/solve?tags=${searchParamsValidation.data.tags?.join(
          ","
        )}&message=update_success`
      );
    }
    case "remove_question": {
      await prisma.questions.update({
        where: {
          public_id: questionPublicId,
          creator: profile.id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
          updated_at: new Date(),
        },
      });

      await prisma.tags_questions_relation.deleteMany({
        where: { questions: { public_id: questionPublicId } },
      });

      return json({ data: "success", error: null });
    }

    case "set_tag": {
      const [question, tag] = await Promise.all([
        prisma.questions.findFirst({
          where: {
            public_id: questionPublicId,
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
              message: `Question not found: ${questionPublicId}`,
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
            public_id: questionPublicId,
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
            error: { message: `Question not found: ${questionPublicId}` },
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
