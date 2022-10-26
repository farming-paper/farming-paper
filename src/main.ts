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
  const { question, index } = generator.gen();

  switch (question.type) {
    case "short": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(question.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (response.answer === question.correct) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.correct})`);
        generator.updateWeight(index, 10);
      }
      break;
    }

    case "short_multi": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(question.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      const answerArray = (response.answer as string)
        .split(",")
        .map((s) => s.trim());

      if (isBagEqual(answerArray, question.correct)) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.correct.join(", ")})`);
        generator.updateWeight(index, 10);
      }
      break;
    }

    case "short_order": {
      const response = await prompts({
        type: "input",
        name: "answer",
        message: getInputPromptsMessage(question.message),
      });

      if (isAbort(response)) {
        process.exit();
      }

      const answerArray = (response.answer as string)
        .split(",")
        .map((s) => s.trim());

      if (isArrayEqual(answerArray, question.correct)) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.correct.join(", ")})`);
        generator.updateWeight(index, 10);
      }
      break;
    }

    case "pick_different":
      console.log("not implemented: pick_different");
      break;

    case "pick": {
      let choices = [...question.wrongs];
      choices.push(question.correct);
      choices = shuffle(choices);

      const response = await prompts({
        type: "list",
        name: "answer",
        message: question.message,
        choices,
      });

      if (response.answer === question.correct) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.correct})`);
        generator.updateWeight(index, 10);
      }
      break;
    }
  }

  console.log("");
}
