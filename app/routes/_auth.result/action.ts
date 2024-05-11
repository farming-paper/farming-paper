import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/auth/get-session";
import prisma from "~/prisma-client.server";
import { searchParamsSchema } from "./searchParamsSchema";

export const actionValidator = withZod(
  z.discriminatedUnion("intent", [
    z.object({ intent: z.literal("ignore") }),
    z.object({ intent: z.literal("regard_as_correct") }),
    z.object({ intent: z.literal("regard_as_incorrect") }),
  ])
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

    case "regard_as_correct": {
      await prisma.solve_logs.update({
        where: {
          id: searchParamsValidation.data.log_id,
          profile_id: profile.id,
        },
        data: {
          weight: 1,
          updated_at: new Date(),
        },
      });

      return redirect(`/solve?tags=${searchParamsValidation.data.tags}`);
    }

    case "regard_as_incorrect": {
      await prisma.solve_logs.update({
        where: {
          id: searchParamsValidation.data.log_id,
          profile_id: profile.id,
        },
        data: {
          weight: 0,
          updated_at: new Date(),
        },
      });

      return redirect(`/solve?tags=${searchParamsValidation.data.tags}`);
    }
  }
}
