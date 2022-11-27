import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Button, Card } from "flowbite-react";
import { nanoid } from "nanoid";
import { Fragment, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { createQuestionGenerator } from "~/question-generator";
import QuestionInput from "~/question/input-components/QuestionInput";
import { links as questionRenderLinks } from "~/question/Render";
import type {
  IFailArgs,
  ISuccessArgs,
  PickDifferentQuestion,
  Question,
} from "~/question/types";
import { getQuestionsById } from "~/question/utils";
import { useConst } from "~/util";

interface ILearnIdPageData {
  questions: Question[];
}

export function links() {
  return [...questionRenderLinks()];
}

export function loader({
  params,
}: LoaderArgs): TypedResponse<ILearnIdPageData> {
  const id = params.id;
  if (!id) {
    return json({ questions: [] });
  }
  return json({
    questions: getQuestionsById(id),
  });
}

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Learn", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export interface IQuestionResult {
  id: string;
  question: string;
  given: string;
  actual: string;
  isSuccess: boolean;
}

export default function LearnId() {
  const { questions } = useLoaderData<ILearnIdPageData>();
  const { id } = useParams<{ id: string }>();
  const generator = useConst(() => createQuestionGenerator(questions));
  const [results, setResults] = useState<IQuestionResult[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<{
    question: Question;
    index: number;
  }>({
    index: -1,
    question: {
      type: "short",
      correct: "",
      message: "",
    },
  });

  useEffect(() => {
    setCurrentQuestion(generator.gen());
  }, [generator]);

  const pushPickDifferentResult = useCallback(
    ({
      given,
      isSuccess,
      question,
    }: {
      question: PickDifferentQuestion;
      given: string;
      isSuccess: boolean;
    }) => {
      setResults((prev) => [
        {
          id: nanoid(),
          question: question.message,
          given,
          actual: question.pool
            .map((onePool) => `[${onePool.join(", ")}]`)
            .join(" "),
          isSuccess,
        },
        ...prev,
      ]);
    },
    []
  );

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
        return pushPickDifferentResult({ given, isSuccess, question });
      }

      setResults((prev) => [
        {
          id: nanoid(),
          question: question.message,
          given,
          actual: Array.isArray(question.correct)
            ? question.correct.join(", ")
            : question.correct,
          isSuccess,
        },
        ...prev,
      ]);
    },
    [pushPickDifferentResult]
  );

  const refreshQuestion = useCallback(() => {
    setCurrentQuestion(generator.gen());
  }, [generator]);

  const handleSuccessQuestion = useCallback(
    ({ given }: ISuccessArgs) => {
      const { question, index } = currentQuestion;

      generator.updateWeight(index, 0.1);
      pushResult({ given, isSuccess: true, question });

      refreshQuestion();
    },
    [currentQuestion, generator, pushResult, refreshQuestion]
  );

  const handleFailQuestion = useCallback(
    ({ given }: IFailArgs) => {
      const { question, index } = currentQuestion;

      generator.updateWeight(index, 10);
      pushResult({ given, isSuccess: false, question });

      refreshQuestion();
    },
    [currentQuestion, generator, pushResult, refreshQuestion]
  );

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        {({ open }) => (
          <>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex items-center flex-shrink-0">
                    <img
                      className="block w-auto h-8 lg:hidden"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                    <img
                      className="hidden w-auto h-8 lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={twMerge(
                          item.current
                            ? "border-indigo-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="w-6 h-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={twMerge(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="flex items-center -mr-2 sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={twMerge(
                      item.current
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex-shrink-0 p-1 ml-auto text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <header>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {String(id).toUpperCase()}
            </h1>
          </div>
        </header>
        <main className="flex flex-col gap-10 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:flex-row">
          <div className="p-4 sm:w-[700px] sm:px-0">
            <div className="mb-3">
              <QuestionInput
                question={currentQuestion.question}
                onSuccess={handleSuccessQuestion}
                onFail={handleFailQuestion}
              />
            </div>
            {/* {JSON.stringify(currentQuestion)} */}
            <div className="flex justify-end gap-3">
              <Button color="gray" onClick={refreshQuestion}>
                패스
              </Button>
            </div>
          </div>
          <ul className="flex flex-col gap-3 px-4 sm:w-96 sm:px-0">
            {results.map((result) => {
              return (
                <Card
                  className={twMerge(
                    "shadow-none",
                    result.isSuccess ? "border-green-300" : "border-red-300"
                  )}
                  key={result.id}
                >
                  <div>{result.question}</div>
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
                </Card>
              );
            })}
          </ul>
        </main>
      </div>
    </div>
  );
}
