import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { generateEnglishQuestion } from "~/question/generator/english/english";
import { typedFetcher } from "~/util";

const { createArgs, getArgsFromRequest, useFetcher } = typedFetcher<
  typeof action,
  { word: string }
>();

export async function action({ request }: ActionFunctionArgs) {
  const args = await getArgsFromRequest(request);

  return json({
    question: await generateEnglishQuestion(args.word),
  });
}

export const useGenerateEnglishQuestionFetcher = useFetcher;

export const createGenerateEnglishQuestionArgs = createArgs;
