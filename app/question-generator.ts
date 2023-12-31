import type { QuestionContent } from "./question/types";
import { deepclone } from "./util";

export function createQuestionGenerator(questions: QuestionContent[]) {
  let total = questions.reduce((acc, current) => {
    return acc + (current.weight || 1);
  }, 0);

  return {
    gen: () => {
      let rand = Math.random() * total;

      for (const { index, question } of questions.map((question, index) => ({
        question,
        index,
      }))) {
        rand -= question.weight || 1;
        if (rand <= 0) {
          return { question: deepclone(question), index };
        }
      }
      return {
        question: deepclone(questions[questions.length - 1]) as QuestionContent,
        index: questions.length - 1,
      };
    },

    updateWeight: (index: number, multiplier: number) => {
      const question = questions[index];
      if (!question) {
        return;
      }

      const newWeight = (question.weight || 1) * multiplier;
      total += newWeight - (question.weight || 1);
      question.weight = newWeight;
    },
  };
}
