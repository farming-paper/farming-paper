/* eslint-disable no-console */

import { createPromptModule } from "inquirer";
import { createQuestionGenerator } from "./question-generator";
import { createQuestion } from "./question/create";
import { questions } from "./question/data/adsp";
import {
  deepclone,
  getPromptsMessage as getInputPromptsMessage,
  isArrayEqual,
  isBagEqual,
  shuffle,
} from "./util";

function isAbort(response: { answer: unknown }) {
  return typeof response.answer === "undefined";
}

// const problems: Question[] = [
//   {
//     type: "pick_different",
//     message: "데이터 사이언스 구성 요소",
//     pool: [
//       [
//         "수학",
//         "확률 모델",
//         "머신러닝",
//         "분석학",
//         "패턴 인식과 학습",
//         "불확실성 모델링",
//       ],
//       [
//         "시그널 프로세싱",
//         "프로그래밍",
//         "데이터 엔지니어링",
//         "데이터 웨어하우징",
//         "고성능 컴퓨팅",
//       ],
//       ["커뮤니케이션", "프레젠테이션", "스토리텔링", "시각화"],
//     ],
//     category: "1",
//     tags: ["2일차"],
//     weight: 2,
//   },
// ];

const prompts = createPromptModule();

// eslint-disable-next-line no-constant-condition
while (true) {
  const generator = createQuestionGenerator(
    questions.map((q) => createQuestion(q))
  );
  const { question, index } = generator.gen();

  if (typeof question.message !== "string") {
    console.error("message is not string", JSON.stringify(question));
    process.exit();
  }

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

      if (isBagEqual(answerArray, question.corrects)) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.corrects.join(", ")})`);
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

      if (isArrayEqual(answerArray, question.corrects)) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${question.corrects.join(", ")})`);
        generator.updateWeight(index, 10);
      }
      break;
    }

    case "pick_different": {
      const pool = shuffle(deepclone(question.pool)).map((bag) => shuffle(bag));
      let group = deepclone(pool[1])?.slice(0, 3);
      const correct = pool[0]?.[0];
      if (!correct || !group) {
        console.error("pick_different error", pool);
        break;
      }

      group.push(correct);
      group = shuffle(group);

      const response = await prompts({
        type: "list",
        name: "answer",
        message: `[${question.message}] 다음 보기 중 다른 것 하나를 고르시오`,
        choices: group,
      });

      if (isAbort(response)) {
        process.exit();
      }

      if (response.answer === correct) {
        console.log("정답!");
        generator.updateWeight(index, 0.1);
      } else {
        console.log(`오답! (정답: ${correct})`);
        generator.updateWeight(index, 10);
      }

      break;
    }
    case "pick": {
      let choices = [...question.options];
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

    default:
      console.error("unknown question type", question);
      process.exit();
  }

  console.log("");
}
