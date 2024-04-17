import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { z } from "zod";
import solveAction from "~/actions/solve";
import { requireAuth } from "~/auth/get-session";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";
import prisma from "~/prisma-client.server";
import ResultQuestion from "~/question/ResultQuestion";
import { QuestionProvider } from "~/question/context";
import { createQuestionContent } from "~/question/create";
import type { Question, QuestionContent } from "~/question/types";
import { getObjBigintToNumber } from "~/util";

export const meta: MetaFunction = () => {
  return [{ title: "대시보드 | Farming Paper" }];
};

const searchParamsSchema = z.object({
  incorrects: z
    .string()
    .transform((v) => JSON.parse(v) as unknown[])
    .pipe(
      z.array(
        z.object({
          pathStr: z.string(),
          expect: z.string(),
          actual: z.string(),
        })
      )
    ),
  tags: z.string().transform((v) => v.split(",")),
  question_id: z.coerce.bigint(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const obj = Object.fromEntries(new URL(request.url).searchParams);

  const validation = searchParamsSchema.safeParse(obj);
  if (!validation.success) {
    throw new Response(null, { status: 400 });
  }

  const { incorrects, question_id, tags } = validation.data;

  const success = incorrects.length === 0;

  const question = await prisma.questions.findUnique({
    where: {
      id: question_id,
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
    incorrects,
    success,
  });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  const q = data.question;
  const { success, incorrects } = data;

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
      <QuestionProvider question={question}>
        <div
          className="box-border px-10 mx-auto mt-20"
          style={{ width: "calc(700px + 3rem)" }}
        >
          <h1 className="text-3xl font-bold">Solve result</h1>
          <p>
            {success ? (
              <span className="text-green-500">Correct</span>
            ) : (
              <span className="text-red-500">Incorrect</span>
            )}
          </p>

          <ResultQuestion incorrects={incorrects} />

          {/* <QuestionProvider question={question}>
          <ResultQuestion />
          <div className="flex flex-row-reverse gap-3">
            <SolveSubmitButton />
          </div>
        </QuestionProvider> */}
        </div>
      </QuestionProvider>
    </DefaultLayout>
  );
}

export const action = solveAction;
