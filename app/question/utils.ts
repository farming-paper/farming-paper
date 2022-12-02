import { deepclone } from "~/util";
import type { MapKey } from "~/util-type";
import { questions as adspQuestions } from "./data/adsp";
import { questions as economicsQuestions } from "./data/economics";
import { questions as mathematicalStatisticsQuestions } from "./data/mathematical-statistics";

export function getQuestionGroups() {
  return new Map([
    ["adsp", { name: "ADSP", questions: deepclone(adspQuestions) }],
    ["economics", { name: "경제학", questions: deepclone(economicsQuestions) }],
    [
      "statistics",
      {
        name: "수리통계학",
        questions: deepclone(mathematicalStatisticsQuestions),
      },
    ],
  ] as const);
}

export type QuestionId = MapKey<ReturnType<typeof getQuestionGroups>>;
