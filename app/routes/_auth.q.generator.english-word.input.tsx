import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { defer } from "@remix-run/server-runtime";
import { Button, Input } from "~/common/components/mockups";

import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useCallback, useMemo, useState } from "react";
import { getSessionWithProfile } from "~/auth/get-session";
import Label from "~/common/components/Label";
import useCmdEnter from "~/common/hooks/use-cmd-enter";
import Render from "~/question/Render";
import { createShortOrderQuestion } from "~/question/create";
import Tags from "~/question/edit-components/Tags";
import { rpc } from "~/supabase/rpc";
import type { ITag, ITagWithCount } from "~/types";
import { removeNullDeep } from "~/util";
import {
  createCreateQuestionArgs,
  useCreateQuestionFetcher,
} from "./_auth.q.create";
import {
  createGenerateEnglishQuestionArgs,
  useGenerateEnglishQuestionFetcher,
} from "./_auth.q.generator.english-word.generate";

export async function getExisingTags(profileId: number) {
  const tagsRes = await rpc("get_tags_by_creator_with_count", {
    p_creator: profileId,
  });

  if (tagsRes.error) {
    throw new Response("Something went wrong while fetching tags", {
      status: 500,
    });
  }

  const tags: ITagWithCount[] = tagsRes.data.map((t) =>
    removeNullDeep({
      publicId: t.public_id,
      desc: t.desc,
      name: t.name || "",
      count: t.count,
    })
  );

  return tags;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  return defer({
    existingTags: getExisingTags(profile.id),
  });
}

export default function Page() {
  const [word, setWord] = useState("");
  const navigate = useNavigate();
  // const [formValues, setFormValues] = useState<QuestionFormValues>({});
  const loaded = useLoaderData<typeof loader>();

  const handleNext = useCallback(() => {
    navigate("/q/generator/english-word/sentence-auto-select/" + word);
  }, [navigate, word]);

  useCmdEnter(handleNext);

  const generateEnglishQuestionFetcher = useGenerateEnglishQuestionFetcher();

  const handleGenerate = useCallback(() => {
    generateEnglishQuestionFetcher.submit(
      createGenerateEnglishQuestionArgs({ word }),
      {
        method: "post",
        action: "/q/generator/english-word/generate",
      }
    );
  }, [generateEnglishQuestionFetcher, word]);

  const createQuestionFetch = useCreateQuestionFetcher();

  // useEffect(() => {
  //   if (createQuestionFetch.state === "idle" && createQuestionFetch.data) {
  //     message.success({
  //       key: "creating",
  //       content: "문제가 성공적으로 생성되었습니다.",
  //     });
  //   }
  // }, [createQuestionFetch.data, createQuestionFetch.state, message]);

  const generated = useMemo(() => {
    if (
      generateEnglishQuestionFetcher.state === "idle" &&
      generateEnglishQuestionFetcher.data
    ) {
      return generateEnglishQuestionFetcher.data.question;
    }
    return null;
  }, [
    generateEnglishQuestionFetcher.data,
    generateEnglishQuestionFetcher.state,
  ]);

  const [tags, setTags] = useState<ITag[]>([]);

  const handleCreateQuestion = useCallback(() => {
    if (!generated) {
      return;
    }
    createQuestionFetch.submit(
      createCreateQuestionArgs({
        question: createShortOrderQuestion({
          message: generated.marked + "\n\n" + generated.translated,
          corrects: generated.extractedWords,
        }),

        tags,
      }),
      {
        method: "post",
        action: `/q/create`,
      }
    );
  }, [createQuestionFetch, generated, tags]);

  return (
    <>
      <div className="flex flex-col mb-4">
        <Label htmlFor="word">태그</Label>
        <Suspense
          fallback={<Tags existingTags={[]} onChange={setTags} value={tags} />}
        >
          <Await
            resolve={loaded.existingTags}
            errorElement={"태그 목록을 불러오는 데 실패했습니다."}
          >
            {(existingTags) => (
              <Tags
                existingTags={existingTags}
                onChange={setTags}
                value={tags}
              />
            )}
          </Await>
        </Suspense>
      </div>
      <div className="flex flex-col mb-4">
        <Label htmlFor="word">영어 단어</Label>
        <Input
          value={word}
          onChange={(e: any) => setWord(e.target.value)}
          id="word"
          placeholder="예: demonstration"
        />
      </div>
      <div className="flex justify-end gap-3">
        {/* <Button onClick={handleNext}>문장 자동 선택</Button> */}
        <Button
          onClick={handleGenerate}
          type={
            generateEnglishQuestionFetcher.state === "idle" &&
            !generateEnglishQuestionFetcher.data
              ? "primary"
              : "default"
          }
          loading={generateEnglishQuestionFetcher.state === "submitting"}
          disabled={!word}
        >
          문제 추출
        </Button>
      </div>
      <AnimatePresence>
        {generated && (
          <motion.div
            key="question"
            className="px-4 py-3 mt-6 rounded-lg shadow-lg bg-gray-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                ease: "easeOut",
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.1,
              },
            }}
          >
            <div className="py-4">
              <dt className="font-medium text-gray-400 ">문제</dt>
              <dd className="mt-1 text-gray-900">
                <Render>
                  {generated.marked + "\n\n" + generated.translated}
                </Render>
              </dd>
            </div>
            <div className="py-4 ">
              <dt className="font-medium text-gray-400 ">정답</dt>
              <dd className="mt-1 font-bold">
                {generated.extractedWords.join(", ")}
              </dd>
            </div>
          </motion.div>
        )}
        {generated && (
          <motion.div
            key="button"
            className="flex justify-end mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                ease: "easeOut",
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.1,
              },
            }}
          >
            <Button
              onClick={handleCreateQuestion}
              type="primary"
              loading={createQuestionFetch.state === "submitting"}
            >
              문제 생성
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
