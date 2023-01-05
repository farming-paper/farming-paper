import type { LoaderArgs, MetaFunction, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button, Modal } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { createQuestionGenerator } from "~/question-generator";
import { createQuestion } from "~/question/create";
import QuestionInput from "~/question/input-components/QuestionInput";
import Render, { links as questionRenderLinks } from "~/question/Render";
import type { IFailArgs, ISuccessArgs, Question } from "~/question/types";
import type { QuestionId } from "~/question/utils";
import { getQuestionGroups } from "~/question/utils";
import { useConst } from "~/util";

interface ILearnIdPageData {
  name: string;
  questions: Question[];
}

export function links() {
  return [...questionRenderLinks()];
}

const motionProps = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
  transition: {
    // x: { type: "spring", stiffness: 30, damping: 30 },
    x: { type: "spring", duration: 0.25, bounce: 0.1 },
    opacity: { duration: 0.2 },
  },
};

export const meta: MetaFunction = ({
  data,
}: {
  data: ILearnIdPageData | undefined;
}) => {
  if (!data) {
    return {
      title: "No data",
      description: "No data found",
      viewport: "width=device-width, initial-scale=1",
    };
  }

  return {
    title: `문제`,
    description: `문제를 푸세요.`,
    // TODO: 디폴트 meta 로 이동.
    viewport: "width=device-width, initial-scale=1",
  };
};

export function loader({
  params,
}: LoaderArgs): TypedResponse<ILearnIdPageData> {
  const id = params.id;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const item = getQuestionGroups().get(id as QuestionId);

  if (!item) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<ILearnIdPageData>({
    name: item.name,
    questions: item.questions.map((q) => createQuestion(q)),
  });
}

export interface IQuestionResult {
  id: string;
  question: string;
  given: string;
  actual: string;
  isSuccess: boolean;
}

export default function LearnId() {
  const { questions, name } = useLoaderData<ILearnIdPageData>();
  const generator = useConst(() => createQuestionGenerator(questions));
  const [result, setResult] = useState<IQuestionResult>({
    id: "",
    actual: "",
    given: "",
    isSuccess: true,
    question: "",
  });
  const [phase, setPhase] = useState<"question" | "result">("question");
  const [i, setI] = useState(1);

  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const nextButton = useRef<HTMLButtonElement>(null);

  const [currentQuestion, setCurrentQuestion] = useState<{
    question: Question;
    index: number;
  }>({
    index: -1,
    question: {
      id: nanoid(),
      type: "short",
      correct: "",
      message: "",
    },
  });

  useEffect(() => {
    setCurrentQuestion(generator.gen());
  }, [generator]);

  /** 다음으로 넘어가는 버튼 자동 포커싱 */
  useEffect(() => {
    setTimeout(() => {
      nextButton.current?.focus();
    });
  }, [phase]);

  const pushResult = useCallback(
    ({
      given,
      isSuccess,
      question,
    }: {
      question: Question;
      given: string;
      isSuccess: boolean;
    }) => {
      if (question.type === "pick_different") {
        setResult({
          id: nanoid(),
          question: question.message,
          given,
          actual: question.pool
            .map((onePool) => `[${onePool.join(", ")}]`)
            .join(" "),
          isSuccess,
        });
        return;
      }

      setResult({
        id: nanoid(),
        question: question.message,
        given,
        actual:
          question.type === "short" || question.type === "pick"
            ? question.correct
            : question.corrects.join(", "),
        isSuccess,
      });
    },
    []
  );

  const refreshQuestion = useCallback(() => {
    setCurrentQuestion(generator.gen());
  }, [generator]);

  const handleSuccessQuestion = useCallback(
    ({ given }: ISuccessArgs) => {
      const { question, index } = currentQuestion;

      generator.updateWeight(index, 0.1);
      pushResult({ given, isSuccess: true, question });
      setPhase("result");
    },
    [currentQuestion, generator, pushResult]
  );

  const handleFailQuestion = useCallback(
    ({ given }: IFailArgs) => {
      const { question, index } = currentQuestion;

      generator.updateWeight(index, 10);
      pushResult({ given, isSuccess: false, question });
      setPhase("result");
    },
    [currentQuestion, generator, pushResult]
  );

  const handleNextClick = useCallback(() => {
    refreshQuestion();
    setPhase("question");
    setI((prev) => prev + 1);
  }, [refreshQuestion]);

  const handleAgainClick = useCallback(() => {
    setPhase("question");
    setI((prev) => prev + 1);
  }, []);

  const handleRegardAsSuccess = useCallback(() => {
    generator.updateWeight(currentQuestion.index, 0.01);
    refreshQuestion();
    setPhase("question");
    setI((prev) => prev + 1);
  }, [currentQuestion.index, generator, refreshQuestion]);

  const handleRegardAsFailure = useCallback(() => {
    generator.updateWeight(currentQuestion.index, 100);
    refreshQuestion();
    setPhase("question");
    setI((prev) => prev + 1);
  }, [currentQuestion.index, generator, refreshQuestion]);

  return (
    <div className="min-h-full">
      {/* Nav가 들어갈 자리 */}
      <div className="py-10">
        <header>
          <div className="flex items-end justify-between gap-3 px-4 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {name}
            </h1>
            <span className="text-sm text-gray-500">{i}번째</span>
          </div>
        </header>
        <main className="relative mx-auto max-w-7xl sm:px-6 lg:px-8 ">
          <AnimatePresence initial={false}>
            {phase === "question" ? (
              <motion.div
                className="absolute left-0 right-0 flex flex-col sm:flex-row"
                key="question"
                {...motionProps}
              >
                <div className="flex-1 p-4 mb-3 ">
                  <QuestionInput
                    question={currentQuestion.question}
                    onSuccess={handleSuccessQuestion}
                    onFail={handleFailQuestion}
                  />
                </div>
                <div className="p-4 border-l">
                  <div className="flex flex-col gap-3">
                    <Button color="gray" onClick={refreshQuestion}>
                      패스
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => setShowAnswerModal(true)}
                    >
                      정답 보기
                    </Button>
                    <Modal
                      open={showAnswerModal}
                      onOk={() => setShowAnswerModal(false)}
                      onCancel={() => setShowAnswerModal(false)}
                    >
                      <h2>정답</h2>
                      <div className="space-y-6">
                        <pre className="overflow-auto text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                          {JSON.stringify(currentQuestion.question, null, 2)}
                        </pre>
                      </div>
                    </Modal>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                {...motionProps}
                className="absolute left-0 right-0 flex flex-col gap-3 p-4 mt-6"
              >
                <h2
                  className={twMerge(
                    "text-2xl mb-1 font-medium",
                    result.isSuccess ? "text-green-600" : "text-red-600"
                  )}
                >
                  {result.isSuccess ? "정답" : "오답"}
                </h2>

                <Render>{result.question}</Render>
                <div>
                  {result.isSuccess ? (
                    <p className="text-green-500">{result.given}</p>
                  ) : (
                    <div>
                      <p className="text-red-500">
                        <span>입력: </span>
                        <span>{result.given}</span>
                      </p>
                      <p>
                        <span>정답: </span>
                        <span>{result.actual}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    ref={nextButton}
                    color="gray"
                    onClick={handleNextClick}
                  >
                    다음
                  </Button>
                  {!result.isSuccess && (
                    <Button color="gray" onClick={handleAgainClick}>
                      다시 풀기
                    </Button>
                  )}
                  {result.isSuccess ? (
                    <Button color="gray" onClick={handleRegardAsFailure}>
                      오답으로 처리
                    </Button>
                  ) : (
                    <Button color="gray" onClick={handleRegardAsSuccess}>
                      정답으로 처리
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
