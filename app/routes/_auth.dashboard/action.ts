import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import { getObjBigintToNumber } from "~/util";
import { searchParamsSchema } from "./searchParamsSchema";

const validator = withZod(
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

export async function action({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const action = await validator.validate(formData);
  const searchParamsValidation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  if (action.error) {
    return json(
      {
        data: null,
        error: action.error,
      },
      { status: 400 }
    );
  }

  if (!searchParamsValidation.success) {
    return json(
      {
        data: null,
        error: searchParamsValidation.error,
      },
      { status: 400 }
    );
  }

  const data = action.data;
  const searchParams = searchParamsValidation.data;

  switch (data.intent) {
    case "update_question_content": {
      const parsedContent = JSON.parse(data.content);

      const deleted = await prisma.questions.update({
        where: {
          public_id: data.public_id,
          creator: profile.id,
          // deleted_at: null, // 삭제가 연속으로 됐을 때 업데이트 대상을 찾지 못하므로 삭제 조건을 넣지 않음
        },
        data: {
          deleted_at: new Date(),
          updated_at: new Date(),
        },
        select: {
          created_at: true,
          creator: true,
          id: true,
          original_id: true,
          tags_questions_relation: {
            select: {
              q: true,
              tag: true,
            },
          },
        },
      });

      const created = await prisma.questions.create({
        data: {
          content: parsedContent,
          creator: deleted.creator,
          created_at: deleted.created_at,
          public_id: nanoid(),
          original_id: deleted.original_id ? deleted.original_id : deleted.id,
          tags_questions_relation: {
            create: deleted.tags_questions_relation.map((tqr) => ({
              tag: tqr.tag,
            })),
          },
        },
        select: {
          content: true,
          created_at: true,
          creator: true,
          id: true,
          original_id: true,
          tags_questions_relation: {
            select: {
              tags: {
                select: {
                  name: true,
                  public_id: true,
                },
              },
            },
          },
        },
      });

      return getObjBigintToNumber({
        ...created,
        tags: created.tags_questions_relation.map((tqr) => tqr.tags),
      });
    }

    case "remove_question": {
      await prisma.questions.update({
        where: {
          public_id: data.public_id,
          creator: profile.id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
          updated_at: new Date(),
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
            ...createQuestionContent({
              type: "short_order",
            }),
          },
        },
      });

      // 만약 선택한 태그가 있었다면 그것도 같이 추가
      if (searchParams.tags) {
        await Promise.all(
          searchParams.tags.map((tag) =>
            prisma.tags_questions_relation.create({
              data: {
                questions: { connect: { id: row.id } },
                tags: { connect: { public_id: tag } },
              },
            })
          )
        );
      }

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
