import type { LoaderArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Question } from "~/problems/types";
import { getQuestionsById } from "~/problems/utils";

interface ILearnIdPageData {
  questions: Question[];
}

export function loader({
  params,
}: LoaderArgs): TypedResponse<ILearnIdPageData> {
  const id = params.id;
  if (!id) {
    return json({ questions: [] });
  }
  return json({ questions: getQuestionsById(id) });
}

export default function LearnId() {
  const { questions } = useLoaderData<ILearnIdPageData>();
  return <div>아이디: {JSON.stringify(questions)}</div>;
}
