import { deepclone } from "~/util";
import { problems as adspProblems } from "./adsp";
import type { Question } from "./types";

export function getQuestionsById(id: string): Question[] {
  switch (id) {
    case "adsp":
      return deepclone(adspProblems);
    default:
      return [];
  }
}
