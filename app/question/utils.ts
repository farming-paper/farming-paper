import { deepclone } from "~/util";
import type { MapKey } from "~/util-type";
import { questions as adspQuestions } from "./data/adsp";
import { questions as economicsQuestions } from "./data/economics";
import { questions as enQuestions } from "./data/exercise-and-nutrition";
import { questions as msQuestions } from "./data/mathematical-statistics";
import { questions as plQuestions } from "./data/programming-linguistics";
import { questions as sstQuestions } from "./data/sample-survey-theory";

export function getQuestionGroups() {
  return new Map([
    ["adsp", { name: "ADSP", questions: deepclone(adspQuestions) }],
    ["economics", { name: "경제학", questions: deepclone(economicsQuestions) }],
    ["statistics", { name: "수리통계학", questions: deepclone(msQuestions) }],
    [
      "programming-linguistics",
      { name: "프로그래밍언어론", questions: deepclone(plQuestions) },
    ],
    [
      "exercise-nutrition",
      { name: "운동과영양", questions: deepclone(enQuestions) },
    ],
    ["sst", { name: "표본조사론", questions: deepclone(sstQuestions) }],
  ] as const);
}

export type QuestionId = MapKey<ReturnType<typeof getQuestionGroups>>;