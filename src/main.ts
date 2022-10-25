// adsp
import { createProblemGenerator } from "./problem-generator";
import { problems } from "./problems/adsp";
import prompts from "prompts";
import { chunk, getPromptsMessage, isArrayEqual, isBagEqual } from "./util";

function isAbort(response: prompts.Answers<"answer">) {
  return typeof response.answer === "undefined";
}

while (true) {
  const generator = createProblemGenerator(problems);
  const problem = generator.gen();

  switch (problem.type) {
    case "short": {
      const response = await prompts({
        type: "text",
        name: "answer",
        message: getPromptsMessage(problem.q),
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (response.answer === problem.correctA) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correctA})`);
      }
      break;
    }

    case "short_multi": {
      const response = await prompts({
        type: "list",
        name: "answer",
        message: getPromptsMessage(problem.q),
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (isBagEqual(response.answer, problem.correctA)) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correctA.join(", ")})`);
      }
      break;
    }

    case "short_order": {
      const response = await prompts({
        type: "list",
        name: "answer",
        message: getPromptsMessage(problem.q),
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (isArrayEqual(response.answer, problem.correctA)) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correctA.join(", ")})`);
      }
      break;
    }

    case "pick_different":
      console.log("not implemented: pick_different");
      break;
    case "pick":
      console.log("not implemented: PICK");
      break;
  }

  console.log("");
}
