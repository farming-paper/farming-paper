import { expect, test } from "vitest";
import { createQuestionGenerator } from "./question-generator";
import { createQuestionContent } from "./question/create";
import type { QuestionContent } from "./question/types";

test("문제가 하나 있을 시 동작", () => {
  const problems: QuestionContent[] = [
    createQuestionContent({
      type: "short",
      message: "test q",
      correct: "test a",
    }),
  ];
  const generator = createQuestionGenerator(problems);
  const { question: problem1 } = generator.gen();
  const { question: problem2 } = generator.gen();
  const { question: problem3 } = generator.gen();
  const { question: problem4 } = generator.gen();
  const { question: problem5 } = generator.gen();
  expect(problem1.message).toEqual("test q");
  expect(problem2.message).toEqual("test q");
  expect(problem3.message).toEqual("test q");
  expect(problem4.message).toEqual("test q");
  expect(problem5.message).toEqual("test q");
});

test("가중치가 큰 것이 앞에 있을 때 잘 동작해야 함", () => {
  const problems: QuestionContent[] = (
    [
      {
        type: "short",
        message: "big",
        weight: Number.MAX_VALUE,
        correct: "test a",
      },
      { type: "short", message: "one", correct: "test a" },
    ] as const
  ).map((q) => createQuestionContent(q));
  const generator = createQuestionGenerator(problems);
  const { question: problem1 } = generator.gen();
  const { question: problem2 } = generator.gen();
  const { question: problem3 } = generator.gen();
  const { question: problem4 } = generator.gen();
  const { question: problem5 } = generator.gen();
  expect(problem1.message).toEqual("big");
  expect(problem2.message).toEqual("big");
  expect(problem3.message).toEqual("big");
  expect(problem4.message).toEqual("big");
  expect(problem5.message).toEqual("big");
});

test("가중치가 큰 것이 뒤에 있을 때 잘 동작해야 함", () => {
  const problems: QuestionContent[] = (
    [
      { type: "short", message: "one", correct: "test a" },
      {
        type: "short",
        message: "big",
        weight: Number.MAX_VALUE,
        correct: "test a",
      },
    ] as const
  ).map((q) => createQuestionContent(q));
  const generator = createQuestionGenerator(problems);
  const { question: problem1 } = generator.gen();
  const { question: problem2 } = generator.gen();
  const { question: problem3 } = generator.gen();
  const { question: problem4 } = generator.gen();
  const { question: problem5 } = generator.gen();
  expect(problem1.message).toEqual("big");
  expect(problem2.message).toEqual("big");
  expect(problem3.message).toEqual("big");
  expect(problem4.message).toEqual("big");
  expect(problem5.message).toEqual("big");
});

test("가중치 대로 나와야 함", () => {
  const problems: QuestionContent[] = (
    [
      { type: "short", message: "one", weight: 1, correct: "test a" },
      { type: "short", message: "two", weight: 2, correct: "test a" },
      { type: "short", message: "three", weight: 3, correct: "test a" },
    ] as const
  ).map((q) => createQuestionContent(q));
  let one = 0;
  let two = 0;
  let three = 0;
  const generator = createQuestionGenerator(problems);
  for (let i = 0; i < 1000; i++) {
    const { question: problem } = generator.gen();
    if (problem.message === "one") {
      one++;
    } else if (problem.message === "two") {
      two++;
    } else if (problem.message === "three") {
      three++;
    }
  }
  // console.log("one, two, three: ", one, two, three);
  expect(one).toBeGreaterThan(100);
  expect(one).toBeLessThan(300);

  expect(two).toBeGreaterThan(200);
  expect(two).toBeLessThan(600);

  expect(three).toBeGreaterThan(300);
  expect(three).toBeLessThan(900);
});
