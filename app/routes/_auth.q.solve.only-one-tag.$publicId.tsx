import { useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { requireAuth } from "~/auth/get-session";
import { Button, Modal } from "~/common/components/mockups";
import { createQuestionGenerator } from "~/question-generator";
import Render, { links as questionRenderLinks } from "~/question/Render";
import { createQuestionFromJson } from "~/question/create";
import QuestionInput from "~/question/input-components/QuestionInput";
import type { ISuccessArgs, QuestionContent } from "~/question/types";
import { getStringAnswer } from "~/question/utils";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { isUserTypingText, useConst } from "~/util";

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

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

  const questions: QuestionContent[] = questionsRes.data.map((q) => {
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
      question: QuestionContent;
    }
  | {
      type: "result";
      actual: string;
      given: string;
      isSuccess: boolean;
      question: QuestionContent;
      index: number;
    }
  | {
      type: "passing";
      question: QuestionContent;
      index: number;
      actual: string;
    };

export default function Page() {
  const { questions, name } = useLoaderData<typeof loader>();
  const generator = useConst(() => createQuestionGenerator(questions));
  const [i, setI] = useState(1);
  /** state 안에 바로 넣는 게 아니라 initialized 변수를 이용하는 이유는, hydration 과정에서 차이가 나기 때문에 gen 시점을 무조건 클라이언트 쪽으로 하기 위함. */
  const initialized = useRef(false);
  const [animationState, setAnimationState] = useState<
    "stop_question" | "to_question" | "stop_result" | "to_result"
  >("stop_question");
  const [display, setDisplay] = useState<QuestionSolveDisplay>({
    type: "question",
    index: -1,
    question: {
      type: "short_order",
      corrects: [],
      id: "",
      message: "",
    },
  });

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    setDisplay({
      type: "question",
      ...generator.gen(),
    });
  }, [generator]);

  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const questionInputRef = useRef(null) as
    | RefObject<HTMLInputElement>
    | RefObject<HTMLTextAreaElement>;
  const antdInputRef = useRef<any>(null);

  const passQuestion = useCallback(() => {
    setDisplay({
      type: "passing",
      question: display.question,
      index: display.index,
      actual: getStringAnswer(display.question),
    });
  }, [display.index, display.question]);

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
        question,
        index,
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
        question,
        index,
      });
    },
    [display, generator]
  );

  const handleNextClick = useCallback(() => {
    setDisplay({
      type: "question",
      ...generator.gen(),
    });

    setI((prev) => prev + 1);
  }, [generator]);

  const handleAgainClick = useCallback(() => {
    if (display.type !== "result") {
      return;
    }

    setDisplay({
      type: "question",
      question: display.question,
      index: display.index,
    });

    setI((prev) => prev + 1);
  }, [display]);

  const handleRegardAsSuccess = useCallback(
    (passing?: boolean) => {
      generator.updateWeight(display.index, passing ? 0.1 : 0.01);
      setDisplay({
        type: "question",
        ...generator.gen(),
      });

      setI((prev) => prev + 1);
    },
    [display, generator]
  );

  const handleRegardAsFailure = useCallback(
    (passing?: boolean) => {
      generator.updateWeight(display.index, passing ? 10 : 100);
      setDisplay({
        type: "question",
        ...generator.gen(),
      });

      setI((prev) => prev + 1);
    },
    [display, generator]
  );

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (
        !isUserTypingText() &&
        e.code === "KeyS" &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        if (display.type === "question") {
          passQuestion();
        } else if (display.type === "passing") {
          handleRegardAsSuccess(true);
        }
      }
    };

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [display.type, handleRegardAsSuccess, passQuestion]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (
        !isUserTypingText() &&
        e.code === "KeyF" &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        if (display.type === "passing") {
          handleRegardAsFailure(true);
        }
      }
    };

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [display.type, handleRegardAsFailure, passQuestion]);

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
                  <Button onClick={passQuestion}>
                    패스 (<code>s</code>)
                  </Button>

                  <Button onClick={() => setShowAnswerModal(true)}>
                    정답 보기
                  </Button>

                  <Button
                    href={`/q/edit/${display.question.id}`}
                    onClick={(e: any) => {
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
          ) : display.type === "result" ? (
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

              <Render>{display.question.message}</Render>
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
                    onClick={() => handleRegardAsFailure()}
                    disabled={animationState !== "stop_result"}
                  >
                    <span className="text-red-600">오답으로 처리</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRegardAsSuccess()}
                    disabled={animationState !== "stop_result"}
                  >
                    <span className="text-green-600">정답으로 처리</span>
                  </Button>
                )}

                <Button
                  href={`/q/edit/${display.question.id}`}
                  onClick={(e: any) => {
                    e.preventDefault();
                    navigate(`/q/edit/${display.question.id}`);
                  }}
                >
                  문제 수정
                </Button>
              </div>
            </motion.div>
          ) : display.type === "passing" ? (
            <motion.div
              key={`result-${i}`}
              {...motionProps}
              className="relative left-0 right-0 flex flex-col gap-3 p-4 mt-6"
            >
              <h2 className="mb-1 text-2xl font-medium">패스</h2>

              <Render>{display.question.message}</Render>

              <p>
                <span>정답: </span>
                <span>{display.actual}</span>
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  ref={nextButtonRef}
                  type="primary"
                  className="mb-3"
                  onClick={handleNextClick}
                  disabled={animationState !== "stop_result"}
                >
                  다음
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleRegardAsSuccess(true)}
                    disabled={animationState !== "stop_result"}
                    className="flex-1 text-green-600"
                  >
                    <span className="text-green-600">
                      정답으로 처리 (<code>s</code>)
                    </span>
                  </Button>

                  <Button
                    onClick={() => handleRegardAsFailure(true)}
                    className="flex-1"
                    disabled={animationState !== "stop_result"}
                  >
                    <span className="text-red-600">
                      오답으로 처리 (<code>f</code>)
                    </span>
                  </Button>
                </div>

                <Button
                  href={`/q/edit/${display.question.id}`}
                  onClick={(e: any) => {
                    e.preventDefault();
                    navigate(`/q/edit/${display.question.id}`);
                  }}
                >
                  문제 수정
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
