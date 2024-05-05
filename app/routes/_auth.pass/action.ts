import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { searchParamsSchema } from "./searchParamsSchema";

const validator = withZod(
  z.discriminatedUnion("intent", [
    z.object({
      intent: z.literal("regard_as_correct"),
    }),

    z.object({
      intent: z.literal("regard_as_incorrect"),
    }),
  ])
);

export async function action({ request }: ActionFunctionArgs) {
  const { profile } = await requireAuth(request);
  const formData = await request.formData();
  const action = await validator.validate(formData);
  const searchParamsValidation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  if (action.error) {
    return json(
      {
        data: null,
        error: action.error,
      },
      { status: 400 }
    );
  }

  if (!searchParamsValidation.success) {
    return json(
      {
        data: null,
        error: searchParamsValidation.error,
      },
      { status: 400 }
    );
  }

  const data = action.data;
  const searchParams = searchParamsValidation.data;

  switch (data.intent) {
    case "regard_as_correct": {
      await prisma.solve_logs.create({
        data: {
          question: { connect: { public_id: searchParams.question_public_id } },
          profile: { connect: { id: profile.id } },
          weight: 1,
        },
      });

      return redirect(`/solve?tags=${searchParams.tags}`);
    }

    case "regard_as_incorrect": {
      await prisma.solve_logs.create({
        data: {
          question: { connect: { public_id: searchParams.question_public_id } },
          profile: { connect: { id: profile.id } },
          weight: 0,
        },
      });

      return redirect(`/solve?tags=${searchParams.tags}`);
    }
  }
}
