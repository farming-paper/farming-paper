import { deepclone } from "~/util";
import type { MapKey } from "~/util-type";
import { questions as adspQuestions } from "./data/adsp";
import { questions as economicsQuestions } from "./data/economics";
import { questions as msQuestions } from "./data/mathematical-statistics";
import { questions as plQuestions } from "./data/programming-linguistics";

export function getQuestionGroups() {
  return new Map([
    ["adsp", { name: "ADSP", questions: deepclone(adspQuestions) }],
    ["economics", { name: "경제학", questions: deepclone(economicsQuestions) }],
    ["statistics", { name: "수리통계학", questions: deepclone(msQuestions) }],
    [
      "programming-linguistics",
      { name: "프로그래밍언어론", questions: deepclone(plQuestions) },
    ],
  ] as const);
}

export type QuestionId = MapKey<ReturnType<typeof getQuestionGroups>>;
