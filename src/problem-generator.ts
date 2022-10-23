import { Problem } from "./problems/types";

export function createProblemGenerator(problems: Problem[]) {
  const total = problems.reduce((acc, current) => {
    return acc + (current.weight || 1);
  }, 0);

  return {
    gen: () => {
      let rand = Math.random() * total;
      for (const problem of problems) {
        rand -= problem.weight || 1;
        if (rand <= 0) {
          return problem;
        }
      }
      return problems[problems.length - 1];
    },
  };
}
