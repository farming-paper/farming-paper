import { Button, Link } from "@nextui-org/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import dayjs from "dayjs";
import { useMemo } from "react";
import { z } from "zod";
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
  tags: z.string(),
  question_id: z.coerce.bigint(),
  log_id: z.coerce.bigint(),
});

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
  });
}

export default function Result() {
  const data = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const q = data.question;
  const { success, incorrects, tags } = data;

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
          <p className="mb-2 text-lg font-bold">
            {success ? (
              <span className="text-green-500">Correct</span>
            ) : (
              <span className="text-red-500">Incorrect</span>
            )}
          </p>

          <ResultQuestion incorrects={incorrects} />

          <div className="flex flex-row-reverse items-center justify-between mt-3">
            <div className="flex items-center">
              <Button as={Link} href={`/solve?tags=${tags}`} color="primary">
                Next
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {success ? (
                <Button variant="flat">Regard as Incorrect</Button>
              ) : (
                <Button variant="flat">Regard as Correct</Button>
              )}

              <Form className="flex" method="post">
                <input type="hidden" name="intent" value="ignore" />
                <Button variant="flat" type="submit">
                  Ignore
                </Button>
              </Form>

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
        </div>
      </QuestionProvider>
    </DefaultLayout>
  );
}

export const actionValidator = withZod(
  z.discriminatedUnion("intent", [z.object({ intent: z.literal("ignore") })])
);

export async function action({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const searchParamsValidation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  const formData = await request.formData();

  if (!searchParamsValidation.success) {
    return json(
      {
        data: null,
        error: searchParamsValidation.error,
      },
      { status: 400 }
    );
  }

  const formDataValidation = await actionValidator.validate(formData);
  if (formDataValidation.error) {
    return json(
      {
        data: null,
        error: formDataValidation.error,
      },
      { status: 400 }
    );
  }

  const data = formDataValidation.data;

  switch (data.intent) {
    case "ignore": {
      await prisma.solve_logs.update({
        where: {
          id: searchParamsValidation.data.log_id,
          profile_id: profile.id,
        },
        data: {
          ignored_since: new Date(),
          updated_at: new Date(),
        },
      });

      return redirect(`/solve?tags=${searchParamsValidation.data.tags}`);
    }
  }
}
