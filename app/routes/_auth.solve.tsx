import { Button, Link } from "@nextui-org/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import { Provider } from "jotai";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import solveAction from "~/actions/solve";
import { requireAuth } from "~/auth/get-session";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";
import { defaultMeta } from "~/meta";
import prisma from "~/prisma-client.server";
import SolveQuestion from "~/question/SolveQuestion";
import SolveSubmitButton from "~/question/SolveSubmitButton";
import { QuestionProvider } from "~/question/context";
import { createQuestionContent } from "~/question/create";
import { createSoftmaxInputV1 } from "~/question/create-solving-softmax-input";
import { randomIndexBasedOnSoftmax } from "~/question/softmax";
import type { Question, QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";

export const meta: MetaFunction = () => {
  return [...defaultMeta, { title: "Solve | Farming Paper" }];
};

const requireParams = (request: Request) => {
  const url = new URL(request.url);

  const tagsValidation = z.string().safeParse(url.searchParams.get("tags"));

  if (!tagsValidation.success) {
    // url.searchParams.delete("tags");
    // throw new Response(null, { status: 301, headers: { Location: url.href } });
    throw new Response(null, { status: 400 });
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

  const randomIndex = randomIndexBasedOnSoftmax(softmaxInputArray);

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
    latestLog: latestLog ? getObjBigintToNumber(latestLog) : null,
    todayCount: logs.length,
    questionPoolCount: questions.length,
  });
}

export default function Dashboard() {
  const {
    question: q,
    todayCount,
    questionPoolCount,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message === "update_success") {
      toast.success("문제가 성공적으로 수정되었습니다.", {
        toastId: message,
      });
    }
  }, []);

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

  return (
    <DefaultLayout sidebarTop={<SideMenuV2 />}>
      <div
        className="box-border px-10 mx-auto mt-20"
        style={{ width: "calc(700px + 3rem)" }}
      >
        <div>
          문제는 총 {questionPoolCount}개, 당신은 {todayCount} 문제를
          풀었습니다. (최근 1달간. 문제 수정 시 초기화)
        </div>
        <QuestionProvider question={question}>
          <Provider>
            <SolveQuestion />
            <div className="flex flex-row-reverse justify-between mt-3">
              <div>
                <SolveSubmitButton />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  href={`/pass?tags=${params.get("tags")}&question_public_id=${
                    question.publicId
                  }`}
                  as={Link}
                  variant="flat"
                >
                  Pass
                </Button>
                <Button
                  href={`/q/edit/${question.publicId}?tags=${params.get(
                    "tags"
                  )}&back=solve`}
                  as={Link}
                  color="default"
                  variant="flat"
                >
                  Edit
                </Button>
              </div>
            </div>
          </Provider>
        </QuestionProvider>
      </div>
    </DefaultLayout>
  );
}

export const action = solveAction;
