import { expect, test } from "vitest";
import { createProblemGenerator } from "./problem-generator";
import { Question } from "./problems/types";

test("문제가 하나 있을 시 동작", () => {
  const problems: Question[] = [
    { type: "short", message: "test q", correct: "test a" },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1.message).toEqual("test q");
  expect(problem2.message).toEqual("test q");
  expect(problem3.message).toEqual("test q");
  expect(problem4.message).toEqual("test q");
  expect(problem5.message).toEqual("test q");
});

test("가중치가 큰 것이 앞에 있을 때 잘 동작해야 함", () => {
  const problems: Question[] = [
    {
      type: "short",
      message: "big",
      weight: 99999999999999999,
      correct: "test a",
    },
    { type: "short", message: "one", correct: "test a" },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1.message).toEqual("big");
  expect(problem2.message).toEqual("big");
  expect(problem3.message).toEqual("big");
  expect(problem4.message).toEqual("big");
  expect(problem5.message).toEqual("big");
});

test("가중치가 큰 것이 뒤에 있을 때 잘 동작해야 함", () => {
  const problems: Question[] = [
    { type: "short", message: "one", correct: "test a" },
    {
      type: "short",
      message: "big",
      weight: 99999999999999999,
      correct: "test a",
    },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1.message).toEqual("big");
  expect(problem2.message).toEqual("big");
  expect(problem3.message).toEqual("big");
  expect(problem4.message).toEqual("big");
  expect(problem5.message).toEqual("big");
});

test("가중치 대로 나와야 함", () => {
  const problems: Question[] = [
    { type: "short", message: "one", weight: 1, correct: "test a" },
    { type: "short", message: "two", weight: 2, correct: "test a" },
    { type: "short", message: "three", weight: 3, correct: "test a" },
  ];
  let one = 0;
  let two = 0;
  let three = 0;
  const generator = createProblemGenerator(problems);
  for (let i = 0; i < 1000; i++) {
    const problem = generator.gen();
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
