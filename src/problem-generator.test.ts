import { expect, test } from "vitest";
import { createProblemGenerator } from "./problem-generator";
import { Problem } from "./problems/types";

test("문제가 하나 있을 시 동작", () => {
  const problems: Problem[] = [
    { type: "short", q: "test q", correctA: "test a" },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1).toEqual({ type: "short", q: "test q", correctA: "test a" });
  expect(problem2).toEqual({ type: "short", q: "test q", correctA: "test a" });
  expect(problem3).toEqual({ type: "short", q: "test q", correctA: "test a" });
  expect(problem4).toEqual({ type: "short", q: "test q", correctA: "test a" });
  expect(problem5).toEqual({ type: "short", q: "test q", correctA: "test a" });
});

test("가중치가 큰 것이 앞에 있을 때 잘 동작해야 함", () => {
  const problems: Problem[] = [
    { type: "short", q: "big", weight: 99999999999999999, correctA: "test a" },
    { type: "short", q: "one", correctA: "test a" },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1.q).toEqual("big");
  expect(problem2.q).toEqual("big");
  expect(problem3.q).toEqual("big");
  expect(problem4.q).toEqual("big");
  expect(problem5.q).toEqual("big");
});

test("가중치가 큰 것이 뒤에 있을 때 잘 동작해야 함", () => {
  const problems: Problem[] = [
    { type: "short", q: "one", correctA: "test a" },
    { type: "short", q: "big", weight: 99999999999999999, correctA: "test a" },
  ];
  const generator = createProblemGenerator(problems);
  const problem1 = generator.gen();
  const problem2 = generator.gen();
  const problem3 = generator.gen();
  const problem4 = generator.gen();
  const problem5 = generator.gen();
  expect(problem1.q).toEqual("big");
  expect(problem2.q).toEqual("big");
  expect(problem3.q).toEqual("big");
  expect(problem4.q).toEqual("big");
  expect(problem5.q).toEqual("big");
});

test("가중치 대로 나와야 함", () => {
  const problems: Problem[] = [
    { type: "short", q: "one", weight: 1, correctA: "test a" },
    { type: "short", q: "two", weight: 2, correctA: "test a" },
    { type: "short", q: "three", weight: 3, correctA: "test a" },
  ];
  let one = 0;
  let two = 0;
  let three = 0;
  const generator = createProblemGenerator(problems);
  for (let i = 0; i < 1000; i++) {
    const problem = generator.gen();
    if (problem.q === "one") {
      one++;
    } else if (problem.q === "two") {
      two++;
    } else if (problem.q === "three") {
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
