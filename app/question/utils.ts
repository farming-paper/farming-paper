import { deepclone } from "~/util";
import { questions as adspQuestions } from "./data/adsp";
import type { Question } from "./types";

export function getQuestionsById(id: string): Question[] {
  switch (id) {
    case "adsp":
      return deepclone(adspQuestions);
    default:
      return [];
  }
}
