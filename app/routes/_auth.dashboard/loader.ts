import type { tags } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import type { ITagWithCount } from "~/types";
import { getObjBigintToNumber } from "~/util";
import { searchParamsSchema } from "./searchParamsSchema";

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const obj = Object.fromEntries(new URL(request.url).searchParams);
  const validation = searchParamsSchema.safeParse(obj);
  if (!validation.success) {
    throw new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { page, tags } = validation.data;

  const [questions, count, recentTags, allTags] = await Promise.all([
    prisma.questions.findMany({
      where: {
        creator: profile.id,
        deleted_at: null,
        tags_questions_relation: tags
          ? { some: { tags: { public_id: { in: tags } } } }
          : undefined,
      },
      orderBy: [{ created_at: "desc" }, { original_id: "asc" }],
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        original_id: true,
        content: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        public_id: true,
        tags_questions_relation: {
          select: { tags: { select: { name: true, public_id: true } } },
        },
      },
    }),

    prisma.questions.count({
      where: {
        creator: profile.id,
        deleted_at: null,
        tags_questions_relation: tags
          ? { some: { tags: { public_id: { in: tags } } } }
          : undefined,
      },
    }),

    // 최근에 추가된 문제에 해당하는 태그 10개
    prisma.$queryRaw`
      SELECT tags.public_id, tags.name, MAX(questions.created_at) as last_q_date
      FROM tags
      INNER JOIN tags_questions_relation ON tags.id = tags_questions_relation.tag
      INNER JOIN questions ON questions.id = tags_questions_relation.q
      WHERE questions.creator = ${profile.id} AND questions.deleted_at IS NULL
      GROUP BY tags.public_id, tags.name
      ORDER BY last_q_date DESC
      LIMIT 10;
    ` as Promise<
      (Pick<tags, "public_id" | "name"> & { last_q_date: string })[]
    >,

    // 모든 태그
    prisma.tags.findMany({
      where: {
        creator: profile.id,
        deleted_at: null,
      },
      orderBy: [{ created_at: "asc" }, { public_id: "asc" }],
      select: {
        public_id: true,
        name: true,
        desc: true,
        _count: {
          select: {
            tags_questions_relation: true,
          },
        },
      },
    }),
  ]);

  return json({
    questions: questions.map((q) => {
      return {
        ...getObjBigintToNumber(q),
        content: createQuestionContent(q.content as Partial<QuestionContent>),
      };
    }),
    count,
    recentTags,
    activeTagPublicIds: tags,
    allTags: allTags.map((tag): ITagWithCount => {
      const result: ITagWithCount = {
        name: tag.name || "",
        publicId: tag.public_id,
        count: tag._count.tags_questions_relation,
      };
      if (tag.desc) {
        result.desc = tag.desc;
      }
      return result;
    }),
  });
}
