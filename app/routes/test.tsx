import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { PartialDeep } from "type-fest";
import { createQuestion } from "~/question/create";
import type { Question, QuestionRow } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { DatabaseTag } from "~/types";
import { removeNullDeep } from "~/util";

export async function loader({ request: _r }: LoaderFunctionArgs) {
  const db = getServerSideSupabaseClient();

  // const result = await db
  //   .from("tags")
  //   .update({
  //     name: "hoho",
  //   })
  //   .eq("creator", 1234)
  //   .single();

  const questionResult = await db
    .from("questions")
    .select("*")
    .eq("id", 32)
    .single();

  if (!questionResult.data) {
    return json({
      error: questionResult.error,
    });
  }

  const tags = await db
    .from("tags_questions_relation")
    .select("tag (*)")
    .eq("q", questionResult.data?.id);

  if (!tags.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const question: QuestionRow = {
    content: createQuestion(
      questionResult.data?.content as PartialDeep<Question>
    ),
    publicId: questionResult.data.public_id,
    updatedAt: questionResult.data.updated_at,
    tags: tags.data.map((t) => {
      const tag = t.tag as unknown as DatabaseTag;
      return removeNullDeep({
        id: tag.id,
        name: tag.name || "",
        publicId: tag.public_id,
        desc: tag.desc,
      });
    }),
  };

  return json({
    question,
  });
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  // useEffect(() => {
  //   console.log("data", data);
  // }, [data]);

  return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
}
