import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getSessionWithProfile } from "~/auth/get-session";
import useCmdEnter from "~/common/hooks/use-cmd-enter";
import { createQuestion, removeUndefined } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import {
  getEngSentences,
  getKorTranslated,
} from "~/question/generator/english/english";
import replace from "~/question/generator/english/replace";
import questionFormResolver from "~/question/question-form-resolver";
import {
  createCreateQuestionArgs,
  useCreateQuestionFetcher,
} from "~/routes/_auth/q.create";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { createTag } from "~/tag/create";
import type { ITag } from "~/types";
import { removeNullDeep } from "~/util";

async function getTags(request: Request) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();

  const tagsRes = await db.from("tags").select("*").eq("creator", profile.id);
  if (tagsRes.error) {
    throw new Response("Something went wrong while fetching tags", {
      status: 500,
    });
  }

  const tags: ITag[] = tagsRes.data.map((t) =>
    removeNullDeep({
      id: t.id,
      publicId: t.public_id,
      desc: t.desc,
      name: t.name || "",
    })
  );

  return tags;
}

async function getSentence(word: string) {
  const sentences = await getEngSentences(word);

  const sentence = sentences[Math.floor(Math.random() * sentences.length)];
  if (!sentence) {
    throw new Response("Unknown Error while fetching sentences", {
      status: 500,
    });
  }

  const translated = await getKorTranslated(sentence);

  const { prevWords, replaced } = replace({
    sourceEngSentence: sentence,
    word,
  });

  return { sentence, translated, prevWords, marked: replaced };
}

export async function loader({ params, request }: LoaderArgs) {
  const word = params.word;
  if (!word) {
    throw new Response("No word", { status: 400 });
  }

  const [s, tags] = await Promise.all([getSentence(word), getTags(request)]);

  return json({ ...s, tags });
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();
  const { marked, prevWords, tags, translated } = loaded;

  const { handleSubmit, formState, control, watch, setValue, setFocus } =
    useForm({
      resolver: questionFormResolver,
      defaultValues: {
        question: {
          type: "short_order",
          message: `${marked}\n\n${translated}`,
          corrects: prevWords,
        },
        tags: [],
      },
    });

  const values = watch();

  const createQuestionFetch = useCreateQuestionFetcher();

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        createQuestionFetch.submit(
          createCreateQuestionArgs({
            question: createQuestion(formData.question),
            tags: removeUndefined(formData.tags).map(createTag),
          }),
          {
            method: "post",
            action: `/q/create`,
          }
        );
      }),
    [createQuestionFetch, handleSubmit]
  );

  useEffect(() => {
    if (createQuestionFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "문제가 성공적으로 생성되었습니다.",
      });
    } else if (createQuestionFetch?.data?.error) {
      message.error({ key: "creating", content: "문제 생성이 실패했습니다." });
      // eslint-disable-next-line no-console
      console.error(
        "createNewFetch?.data?.error",
        createQuestionFetch?.data?.error
      );
    }
  }, [createQuestionFetch?.data?.data, createQuestionFetch?.data?.error]);

  useEffect(() => {
    if (createQuestionFetch.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 생성하는 중입니다...",
      });
      setTimeout(() => {
        setValue("question.message", "");
        setValue("question.corrects", [""]);
        setFocus("question.message");
      });
    }
  }, [createQuestionFetch.state, setFocus, setValue]);

  useCmdEnter(onSubmit);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400">1. 단어 입력</span>
        <span>-</span>
        <span className="font-bold text-green-600">2. 문제 점검</span>
      </div>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
        existingTags={tags}
      />
      <div className="flex justify-end">
        <Button
          loading={createQuestionFetch.state === "submitting"}
          htmlType="submit"
          onClick={onSubmit}
          type="primary"
        >
          만들기
        </Button>
      </div>
    </>
  );
}
