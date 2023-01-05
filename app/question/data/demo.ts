import type { PartialDeep } from "~/types";
import type { Question } from "../types";

export const questions: PartialDeep<Question>[] = [
  {
    type: "short_order",
    message:
      "short_order 문제는 정답을 순서대로 입력해야 합니다. 이 문제에서 **가, 나**라고 치면 정답이지만, **나, 가**라고 치면 오답입니다.",
    corrects: ["가", "나"],
    tags: ["테스트_태그"],
  },
  {
    type: "short_multi",
    message:
      "short_multi 문제는 여러 정답을 순서 없이 입력해도 됩니다. 이 문제에서 **가, 나**라고 치면 정답이고, **나, 가**라고 쳐도 정답입니다.",
    corrects: ["가", "나"],
    tags: ["테스트_태그"],
  },
  {
    type: "pick",
    message:
      "문제는 마크다운을 지원합니다. katex 기반 수식도 지원합니다. $y=ax+b$. 그리고 틀린 문제는 출제 확률이 10배씩 올라갑니다.",
    correct: "알겠습니다.",
    options: ["네?? 뭐야??"],
    tags: ["테스트_태그"],
  },
  {
    type: "short_order",
    message:
      "정보를 따로 저장해두는 곳은? MySQL, MongoDB 등이 있습니다. (한글로 6글자)",
    corrects: ["데이터베이스"],
    tags: ["테스트_태그"],
  },
];
