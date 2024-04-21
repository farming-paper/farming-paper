import { Button, Link } from "@nextui-org/react";
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
  tags: z.string(),
  question_public_id: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  const obj = Object.fromEntries(new URL(request.url).searchParams);

  const validation = searchParamsSchema.safeParse(obj);
  if (!validation.success) {
    throw new Response(null, { status: 400 });
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
  });
}

const emptyArray: {
  pathStr: string;
  expect: string;
  actual: string;
}[] = [];

export default function Pass() {
  const data = useLoaderData<typeof loader>();
  const tags = data.tags;

  const q = data.question;

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
          <ResultQuestion
            incorrects={emptyArray}
            correctClassname="text-black"
          />
          <div className="flex flex-row-reverse justify-between mt-3">
            <Button
              as={Link}
              href={`/solve?tags=${tags}`}
              color="primary"
              className="mt-5"
            >
              Next
            </Button>
          </div>
        </div>
      </QuestionProvider>
    </DefaultLayout>
  );
}

export const action = solveAction;
