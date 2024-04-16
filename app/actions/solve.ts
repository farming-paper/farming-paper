import { json, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import { getBlankByPath, getCorrectFromBlank } from "~/question/utils";

export const validator = withZod(
  z.discriminatedUnion("intent", [
    z.object({
      intent: z.literal("solve"),
      question_id: z.coerce.number(),
      submission: z
        .string()
        .transform((v) => {
          return JSON.parse(v) as Record<string, string>;
        })
        .pipe(z.record(z.string()))
        .transform((v) => Object.entries(v))
        .pipe(
          z.array(
            z.tuple([
              z
                .string()
                .transform((rawKey) => rawKey.split("-"))
                .pipe(
                  z.array(z.string().transform((numLike) => Number(numLike)))
                ),
              z.string(),
            ])
          )
        ),
    }),
  ])
);

export default async function solveAction({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const action = await validator.validate(formData);

  if (action.error) {
    return json(
      {
        data: null,
        error: action.error,
      },
      { status: 400 }
    );
  }

  const data = action.data;

  switch (data.intent) {
    case "solve": {
      const question = await prisma.questions.findFirst({
        where: {
          id: action.data.question_id,
          creator: profile.id,
          deleted_at: null,
        },
        select: {
          content: true,
        },
      });

      if (!question || !question.content) {
        return json(
          { data: null, error: { message: "Question not found" } },
          { status: 404 }
        );
      }

      const content: QuestionContent = createQuestionContent(
        question.content as Partial<QuestionContent>
      );

      const descendants = content.descendants;
      if (!descendants) {
        return json(
          { data: null, error: { message: "Question content not found" } },
          { status: 404 }
        );
      }

      for (const [path, submission] of data.submission) {
        const blank = getBlankByPath(descendants, path);

        if (!blank) {
          return json(
            { data: null, error: { message: "Blank not found", path } },
            { status: 404 }
          );
        }

        const answer = getCorrectFromBlank(blank);
        if (answer !== submission) {
          return json(
            {
              data: null,
              error: { message: "Submission not matched", path, answer },
            },
            { status: 400 }
          );
        }
      }
    }
  }

  return json({ data: "success" });
}
