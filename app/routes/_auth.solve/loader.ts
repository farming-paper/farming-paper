import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import { createSoftmaxInputV1 } from "~/question/create-solving-softmax-input";
import { randomIndexBasedOnSoftmax } from "~/question/softmax";
import type { QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";
import { searchParamsSchema } from "./searchParamsSchema";

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);
  const validation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  if (!validation.success) {
    throw new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const tags = validation.data.tags;

  const questions = await prisma.questions.findMany({
    where: {
      creator: profile.id,
      deleted_at: null,
      tags_questions_relation: { some: { tags: { public_id: { in: tags } } } },
    },
    orderBy: [{ created_at: "desc" }, { original_id: "asc" }],
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

  const logs = await prisma.solve_logs.findMany({
    where: {
      question_id: { in: questions.map((q) => q.id) },
      profile_id: profile.id,
      // drop more than 1 month
      created_at: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
      ignored_since: null,
    },
    orderBy: [{ created_at: "desc" }],
    select: {
      weight: true,
      question_id: true,
      created_at: true,
    },
  });

  const tagNames = [
    ...new Set<string>(
      questions
        .flatMap((q) =>
          q.tags_questions_relation
            .filter((r) => tags.includes(r.tags.public_id))
            .map((t) => t.tags.name || "")
        )
        .filter((x) => x)
    ),
  ];

  const softmaxInputMap = new Map<
    /** question_id */ bigint,
    { elapsed_min: number; value: number }[]
  >(questions.map((question) => [question.id, []]));

  for (const log of logs) {
    const softmaxInput = softmaxInputMap.get(log.question_id) || [];
    if (!softmaxInput) {
      continue;
    }

    softmaxInput.push({
      elapsed_min: (Date.now() - log.created_at.getTime()) / 1000 / 60,
      value: log.weight,
    });
  }

  const entries = [...softmaxInputMap.entries()];

  let softmaxInputArray = entries.map(([_, softmaxInput]) => {
    return createSoftmaxInputV1(softmaxInput);
  });

  if (softmaxInputArray.every((x) => x === 0)) {
    softmaxInputArray = Array.from<number>({
      length: softmaxInputArray.length,
    }).fill(1);
  }

  const { index: randomIndex, probability } =
    randomIndexBasedOnSoftmax(softmaxInputArray);

  const question = questions[randomIndex]!;

  const thatLogs = [...logs].filter((log) => log.question_id === question.id);
  thatLogs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  let latestLog = thatLogs[0];

  return json({
    question: {
      ...getObjBigintToNumber(question),
      content: createQuestionContent(
        question.content as Partial<QuestionContent>
      ),
    },
    activeTagPublicIds: tags,
    tagNames,
    latestLog: latestLog ? getObjBigintToNumber(latestLog) : null,
    todayCount: logs.length,
    questionPoolCount: questions.length,
    probability,
  });
}
