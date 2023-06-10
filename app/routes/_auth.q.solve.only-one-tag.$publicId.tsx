import { useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { InputRef } from "antd";
import { Button, Modal } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getSessionWithProfile } from "~/auth/get-session";
import { createQuestionGenerator } from "~/question-generator";
import { createQuestionFromJson } from "~/question/create";
import QuestionInput from "~/question/input-components/QuestionInput";
import Render, { links as questionRenderLinks } from "~/question/Render";
import type { ISuccessArgs, Question } from "~/question/types";
import { getStringAnswer } from "~/question/utils";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { useConst } from "~/util";

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

export async function loader({ request, params }: LoaderArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const db = getServerSideSupabaseClient();
  const tagPublicId = params.publicId;
  if (!tagPublicId) {
    throw new Response("No tag public id", { status: 400 });
  }

  const questionsRes = await db
    .from("questions")
    .select("*, tags_questions_relation!inner( tags!inner( public_id, name ))")
    .eq("tags_questions_relation.tags.public_id", tagPublicId)
    .eq("creator", profile.id);

  if (questionsRes.error) {
    throw new Response(questionsRes.error.message, { status: 500 });
  }

  const questions: Question[] = questionsRes.data.map((q) => {
    // TODO: fix duplicated question ids. they are in db records and content itself.
    return { ...createQuestionFromJson(q.content), id: q.public_id };
  });

  if (questions.length === 0) {
    throw new Response("No questions", { status: 404 });
  }

  return json({ questions, name: "" });
}

type QuestionSolveDisplay =
  | {
      type: "question";
      index: number;
      question: Question;
    }
  | {
      type: "result";
      actual: string;
      given: string;
      isSuccess: boolean;
      prevQuestion: Question;
      prevIndex: number;
    };

export default function Page() {
  const { questions, name } = useLoaderData<typeof loader>();
  const generator = useConst(() => createQuestionGenerator(questions));
  const [i, setI] = useState(1);
  const initialized = useRef(false);
  const [animationState, setAnimationState] = useState<
    "stop_question" | "to_question" | "stop_result" | "to_result"
  >("stop_question");
  const [display, setDisplay] = useState<QuestionSolveDisplay>({
    type: "question",
    index: -1,
    question: {
      id: "initialized",
      type: "short",
      correct: "",
      message: "",
    },
  });

  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const questionInputRef = useRef(null) as
    | RefObject<HTMLInputElement>
    | RefObject<HTMLTextAreaElement>;
  const antdInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    setDisplay({
      type: "question",
      ...generator.gen(),
    });
  }, [generator]);

  const refreshQuestion = useCallback(() => {
    setDisplay({
      type: "question",
      ...generator.gen(),
    });
  }, [generator]);

  const handleSuccessQuestion = useCallback(
    ({ given }: ISuccessArgs) => {
      if (display.type !== "question") {
        return;
      }
      const { question, index } = display;

      generator.updateWeight(index, 0.1);

      setDisplay({
        type: "result",
        actual: getStringAnswer(question),
        given,
        isSuccess: true,
        prevQuestion: question,
        prevIndex: index,
      });
    },
    [display, generator]
  );

  const handleFailQuestion = useCallback(
    ({ given }: ISuccessArgs) => {
      if (display.type !== "question") {
        return;
      }
      const { question, index } = display;

      generator.updateWeight(index, 10);

      setDisplay({
        type: "result",
        actual: getStringAnswer(question),
        given,
        isSuccess: false,
        prevQuestion: question,
        prevIndex: index,
      });
    },
    [display, generator]
  );

  const handleNextClick = useCallback(() => {
    if (display.type !== "result") {
      return;
    }

    setDisplay({
      type: "question",
      ...generator.gen(),
    });

    setI((prev) => prev + 1);
  }, [display, generator]);

  const handleAgainClick = useCallback(() => {
    if (display.type !== "result") {
      return;
    }

    setDisplay({
      type: "question",
      question: display.prevQuestion,
      index: display.prevIndex,
    });

    setI((prev) => prev + 1);
  }, [display]);

  const handleRegardAsSuccess = useCallback(() => {
    if (display.type !== "result") {
      return;
    }

    generator.updateWeight(display.prevIndex, 0.01);
    setDisplay({
      type: "question",
      ...generator.gen(),
    });

    setI((prev) => prev + 1);
  }, [display, generator]);

  const handleRegardAsFailure = useCallback(() => {
    if (display.type !== "result") {
      return;
    }

    generator.updateWeight(display.prevIndex, 100);
    setDisplay({
      type: "question",
      ...generator.gen(),
    });

    setI((prev) => prev + 1);
  }, [display, generator]);

  // const setIsAnimatingFalse = useCallback(() => {
  //   setAnimationState((animationState) => {
  //     if (animationState === "to_question") {
  //       return "stop_question";
  //     } else if (animationState === "to_result") {
  //       return "stop_result";
  //     }
  //     return animationState;
  //   });
  // }, []);

  useEffect(() => {
    if (display) {
      let timeout: ReturnType<typeof setTimeout>;
      if (display.type === "question") {
        setAnimationState("to_question");
        timeout = setTimeout(() => {
          setAnimationState("stop_question");
        }, 100);
      } else {
        setAnimationState("to_result");
        timeout = setTimeout(() => {
          setAnimationState("stop_result");
        }, 100);
      }

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [display]);

  useEffect(() => {
    if (animationState === "to_question" || animationState === "to_result") {
      return;
    }

    if (animationState === "stop_question") {
      antdInputRef.current?.focus();
    } else if (animationState === "stop_result") {
      nextButtonRef.current?.focus();
    }
  }, [animationState]);

  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      <header>
        <div className="flex items-end justify-between gap-3 px-4 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {name}
          </h1>
          <span className="text-sm text-gray-500">{i}번째</span>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl">
        <AnimatePresence mode="popLayout">
          {display.type === "question" ? (
            <motion.div
              className="relative left-0 right-0 flex flex-col"
              key={`question-${i}`}
              {...motionProps}
            >
              <div className="flex-1 p-4 mb-3 ">
                <QuestionInput
                  disabled={animationState !== "stop_question"}
                  inputRef={questionInputRef}
                  antdInputRef={antdInputRef}
                  question={display.question}
                  onSuccess={handleSuccessQuestion}
                  onFail={handleFailQuestion}
                />
              </div>
              <div className="p-4 ">
                <div className="flex flex-col gap-3">
                  <Button onClick={refreshQuestion}>패스</Button>
                  <Button onClick={() => setShowAnswerModal(true)}>
                    정답 보기
                  </Button>
                  <Button
                    href={`/q/edit/${display.question.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/q/edit/${display.question.id}`);
                    }}
                  >
                    문제 수정
                  </Button>
                  <Modal
                    open={showAnswerModal}
                    closable={false}
                    okButtonProps={{ className: "hidden" }}
                    footer={null}
                    cancelButtonProps={{ className: "hidden" }}
                    onCancel={() => setShowAnswerModal(false)}
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <h2 className="font-medium">정답</h2>
                        <pre className="mb-0 overflow-auto text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                          {getStringAnswer(display.question)}
                        </pre>
                      </div>
                      <div>
                        <h2 className="font-medium">Raw Data</h2>
                        <pre className="mb-0 overflow-auto text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                          {JSON.stringify(display.question, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`result-${i}`}
              {...motionProps}
              className="relative left-0 right-0 flex flex-col gap-3 p-4 mt-6"
            >
              <h2
                className={twMerge(
                  "text-2xl mb-1 font-medium",
                  display.isSuccess ? "text-green-600" : "text-red-600"
                )}
              >
                {display.isSuccess ? "정답" : "오답"}
              </h2>

              <Render>{display.prevQuestion.message}</Render>
              <div>
                {display.isSuccess ? (
                  <p className="text-green-500">{display.given}</p>
                ) : (
                  <div>
                    <p className="text-red-500">
                      <span>입력: </span>
                      <span>{display.given}</span>
                    </p>
                    <p>
                      <span>정답: </span>
                      <span>{display.actual}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  ref={nextButtonRef}
                  type="primary"
                  className="mb-7"
                  onClick={handleNextClick}
                  disabled={animationState !== "stop_result"}
                >
                  다음
                </Button>
                {!display.isSuccess && (
                  <Button
                    onClick={handleAgainClick}
                    disabled={animationState !== "stop_result"}
                  >
                    다시 풀기
                  </Button>
                )}
                {display.isSuccess ? (
                  <Button
                    onClick={handleRegardAsFailure}
                    disabled={animationState !== "stop_result"}
                  >
                    오답으로 처리
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegardAsSuccess}
                    disabled={animationState !== "stop_result"}
                  >
                    정답으로 처리
                  </Button>
                )}

                <Button
                  href={`/q/edit/${display.prevQuestion.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/q/edit/${display.prevQuestion.id}`);
                  }}
                >
                  문제 수정
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
