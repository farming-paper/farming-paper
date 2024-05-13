import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";
import { searchParamsSchema } from "./searchParamsSchema";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  const obj = Object.fromEntries(new URL(request.url).searchParams);

  const validation = searchParamsSchema.safeParse(obj);
  if (!validation.success) {
    throw new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { question_public_id } = validation.data;

  const question = await prisma.questions.findUnique({
    where: {
      public_id: question_public_id,
    },
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
  });

  if (!question) {
    throw new Response(null, { status: 404 });
  }

  return json({
    question: {
      ...getObjBigintToNumber(question),
      content: createQuestionContent(
        question.content as Partial<QuestionContent>
      ),
    },
    tags: validation.data.tags,
    tagNames: question.tags_questions_relation
      .map((t) => t.tags)
      .filter((t) => validation.data.tags.includes(t.public_id))
      .map((t) => t.name)
      .filter((t) => t),
  });
}
