import { createProblemGenerator } from "./problem-generator";
import { problems } from "./problems/adsp";
import { createPromptModule } from "inquirer";
import {
  getPromptsMessage as getInputPromptsMessage,
  isArrayEqual,
  isBagEqual,
  shuffle,
} from "./util";
import { Question } from "./problems/types";

function isAbort(response: { answer: any }) {
  return typeof response.answer === "undefined";
}

// const problems: Problem[] = [
//   {
//     type: "pick",
//     correctA: "비선형적",
//     q: "인공신경망은 ___인 문제를 분석하는 데 유용하다.",
//     wrongAs: ["선형적"],
//   },
// ];

const prompts = createPromptModule();

while (true) {
  const generator = createProblemGenerator(problems);
  const problem = generator.gen();

  switch (problem.type) {
    case "short": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(problem.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (response.answer === problem.correct) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correct})`);
      }
      break;
    }

    case "short_multi": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(problem.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      const answerArray = (response.answer as string)
        .split(",")
        .map((s) => s.trim());

      if (isBagEqual(answerArray, problem.corrects)) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.corrects.join(", ")})`);
      }
      break;
    }

    case "short_order": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(problem.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      const answerArray = (response.answer as string)
        .split(",")
        .map((s) => s.trim());

      if (isArrayEqual(answerArray, problem.corrects)) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.corrects.join(", ")})`);
      }
      break;
    }

    case "pick_different":
      console.log("not implemented: pick_different");
      break;

    case "pick": {
      let choices = [...problem.wrongAs];
      choices.push(problem.correct);
      choices = shuffle(choices);

      const response = await prompts({
        type: "list",
        name: "answer",
        message: problem.message,
        choices: choices,
      });

      if (response.answer === problem.correct) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correct})`);
      }
      break;
    }
  }

  console.log("");
}
