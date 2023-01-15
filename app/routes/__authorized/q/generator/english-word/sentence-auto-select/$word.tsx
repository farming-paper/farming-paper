import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import {
  getEngSentences,
  getKorTranslated,
} from "~/question/generator/english/english";
import replace from "~/question/generator/english/replace";

export async function loader({ params }: LoaderArgs) {
  const word = params.word;
  if (!word) {
    throw new Response("No word", { status: 400 });
  }

  const sentences = await getEngSentences(word);

  const sentence = sentences[Math.floor(Math.random() * sentences.length)];
  if (!sentence) {
    throw new Response("Unknown Error while fetching sentences", {
      status: 500,
    });
  }

  const translated = await getKorTranslated(sentence);

  const marked = replace({ sourceEngSentence: sentence, word });

  return json({ sentence, translated, marked });
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();

  return (
    <div>
      <pre>{JSON.stringify(loaded, null, 2)}</pre>
    </div>
  );
}
