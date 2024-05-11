import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";
import { searchParamsSchema } from "./searchParamsSchema";

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const obj = Object.fromEntries(new URL(request.url).searchParams);

  const validation = searchParamsSchema.safeParse(obj);
  if (!validation.success) {
    throw new Response(null, { status: 400 });
  }

  const { incorrects, question_id } = validation.data;

  const success = incorrects.length === 0;

  const question = await prisma.questions.findUnique({
    where: {
      id: question_id,
      creator: profile.id,
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
  const currentTags = validation.data.tags.split(",");
  const tagNames = question.tags_questions_relation
    .filter((relation) => currentTags.includes(relation.tags.public_id))
    .map((relation) => relation.tags.name || "")
    .filter((name) => name);

  return json({
    question: {
      ...getObjBigintToNumber(question),
      content: createQuestionContent(
        question.content as Partial<QuestionContent>
      ),
    },
    incorrects,
    success,
    tags: validation.data.tags,
    tagNames,
  });
}
