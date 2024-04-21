import {
  json,
  redirect,
  type ActionFunctionArgs,
} from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { createQuestionContent } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import {
  getBlankByPath,
  getCorrectFromBlank,
  getIdFromPath,
} from "~/question/utils";

export const formDataValidator = withZod(
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
        .transform((v) =>
          Object.entries(v).map(([k, v]) => ({
            path: k,
            value: v,
          }))
        )
        .pipe(
          z.array(
            z.object({
              path: z
                .string()
                .transform((rawKey) => rawKey.split("-"))
                .pipe(
                  z.array(z.string().transform((numLike) => Number(numLike)))
                ),
              value: z.string(),
            })
          )
        ),
    }),
  ])
);

const requireSearchParams = (request: Request) => {
  const url = new URL(request.url);
  const tagsValidation = z.string().safeParse(url.searchParams.get("tags"));

  if (!tagsValidation.success) {
    // url.searchParams.delete("tags");
    // throw new Response(null, { status: 301, headers: { Location: url.href } });
    throw new Response(null, { status: 400 });
  }

  return {
    tags: tagsValidation.data,
  };
};

export default async function solveAction({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const { tags: tagsFromUrl } = requireSearchParams(request);
  const action = await formDataValidator.validate(formData);

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
          id: true,
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

      const incorrects: { pathStr: string; expect: string; actual: string }[] =
        [];

      for (const { path, value: submission } of data.submission) {
        const blank = getBlankByPath(descendants, path);

        if (!blank) {
          return json(
            { data: null, error: { message: "Blank not found", path } },
            { status: 404 }
          );
        }

        const answer = getCorrectFromBlank(blank);
        if (answer !== submission) {
          incorrects.push({
            pathStr: getIdFromPath(path),
            expect: answer,
            actual: submission,
          });
        }
      }

      let logId: bigint;
      if (incorrects.length > 0) {
        const res = await prisma.solve_logs.create({
          data: {
            profile_id: profile.id,
            question_id: question.id,
            weight: 0,
          },
          select: {
            id: true,
          },
        });
        logId = res.id;
      } else {
        const res = await prisma.solve_logs.create({
          data: {
            profile_id: profile.id,
            question_id: question.id,
            weight: 1,
          },
          select: {
            id: true,
          },
        });
        logId = res.id;
      }

      const searchParams = new URLSearchParams();
      searchParams.set("incorrects", JSON.stringify(incorrects));
      searchParams.set("question_id", question.id.toString());
      searchParams.set("tags", tagsFromUrl);
      searchParams.set("log_id", logId.toString());
      return redirect(`/result?${searchParams.toString()}`);
    }
  }
}
