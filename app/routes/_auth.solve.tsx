import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { z } from "zod";
import dashboardAction from "~/actions/dashboard";
import { requireAuth } from "~/auth/get-session";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";
import prisma from "~/prisma-client.server";
import SolveQuestion, { SolveBlankProvider } from "~/question/SolveQuestion";
import { QuestionProvider } from "~/question/context";
import { createQuestion } from "~/question/create";
import { createSoftmaxInputV1 } from "~/question/create-solving-softmax-input";
import { randomIndexBasedOnSoftmax } from "~/question/softmax";
import type { Question, QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";

export const meta: MetaFunction = () => {
  return [{ title: "대시보드 | Farming Paper" }];
};

const requireParams = (request: Request) => {
  const url = new URL(request.url);

  const tagsValidation = z
    .union([z.null(), z.string()])
    // .optional()
    .safeParse(url.searchParams.get("tags"));

  if (!tagsValidation.success) {
    url.searchParams.delete("tags");
    throw new Response(null, { status: 301, headers: { Location: url.href } });
  }

  return {
    tags: tagsValidation.data?.split(","),
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const { tags } = requireParams(request);

  const questions = await prisma.questions.findMany({
    where: {
      creator: profile.id,
      deleted_at: null,
      tags_questions_relation: tags
        ? { some: { tags: { public_id: { in: tags } } } }
        : undefined,
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
      question: { creator: profile.id },
      // drop more than 1 month
      created_at: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
    },
    orderBy: [{ created_at: "desc" }],
    select: {
      weight: true,
      question_id: true,
      created_at: true,
    },
  });

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
      elapsed_min: Math.floor(
        (Date.now() - log.created_at.getTime()) / 1000 / 60
      ),
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

  const randomIndex = randomIndexBasedOnSoftmax(softmaxInputArray);

  const question = questions[randomIndex]!;

  const thatLogs = [...logs].filter((log) => log.question_id === question.id);
  thatLogs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  let latestLog = thatLogs[0];

  return json({
    question: {
      ...getObjBigintToNumber(question),
      content: createQuestion(question.content as Partial<QuestionContent>),
    },
    activeTagPublicIds: tags,
    latestLog: latestLog ? getObjBigintToNumber(latestLog) : null,
  });
}

export default function Dashboard() {
  const { question: q } = useLoaderData<typeof loader>();

  const question: Question = useMemo(
    () => ({
      id: q.id,
      originalId: q.original_id,
      content: q.content,
      createdAt: dayjs(q.created_at),
      updatedAt: dayjs(q.updated_at),
      deletedAt: q.deleted_at ? dayjs(q.deleted_at) : null,
      publicId: q.public_id,
      tags: q.tags_questions_relation.map((t) => {
        return {
          name: t.tags.name || "",
          publicId: t.tags.public_id,
        };
      }),
    }),
    [q]
  );
  // const [params] = useSearchParams();

  // const { questions } = data;

  // const tagFilters = useMemo(() => {
  //   const activeTagPublicIdsSet = new Set(activeTagPublicIds);
  //   return recentTags.map((tag) => ({
  //     publicId: tag.public_id,
  //     name: tag.name || "",
  //     active: activeTagPublicIdsSet.has(tag.public_id),
  //   }));
  // }, [activeTagPublicIds, recentTags]);

  // const addTagFilter = useAddTagFilter();

  // const deleteTagFilter = useDeleteTagFilter();

  // const questions: Question[] = useMemo(
  //   () =>
  //     data.questions.map(
  //       (q): Question => ({
  //         id: q.id,
  //         originalId: q.original_id,
  //         content: q.content,
  //         createdAt: dayjs(q.created_at),
  //         updatedAt: dayjs(q.updated_at),
  //         deletedAt: q.deleted_at ? dayjs(q.deleted_at) : null,
  //         publicId: q.public_id,
  //         tags: q.tags_questions_relation.map((t) => {
  //           return {
  //             name: t.tags.name || "",
  //             publicId: t.tags.public_id,
  //           };
  //         }),
  //       })
  //     ),
  //   [data.questions]
  // );

  // useEffect(() => {
  //   console.log("questions", questions);
  // }, [questions]);

  return (
    <DefaultLayout sidebarTop={<SideMenuV2 />}>
      <div
        className="box-border px-10 mx-auto mt-20"
        style={{ width: "calc(700px + 3rem)" }}
      >
        <QuestionProvider question={question}>
          <SolveBlankProvider>
            <SolveQuestion />
          </SolveBlankProvider>
        </QuestionProvider>
      </div>
    </DefaultLayout>
  );
}

export const action = dashboardAction;
