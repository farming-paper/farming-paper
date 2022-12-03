import type { Question } from "../types";

export const questions: Question[] = [
  {
    type: "short_order",
    message: "칼 피어슨의 추정법은? ___ 법.",
    correct: ["적률추정"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "피셔의 추정법은? ___ 법.",
    correct: ["최대가능도"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "표본의 수가 무한히 증가함에 따라 통계량...????",
    correct: ["최대가능도"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "___ : 통계량의 모든 가능한 값을 평균하면 모수와 같아지는 성질",
    correct: ["불편성"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message:
      "___ : 통계량 값이 모수를 중심으로 얼마나 밀집하는지를 나타내는 성질",
    correct: ["효율성"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message:
      "___ : 표본크기가 증가할수록 추정량의 분포가 모수값으로 집중되어 가는 성질",
    correct: ["일치성"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message:
      "___ : 표본크기가 증가할수록 추정량의 분포가 모수값으로 집중되어 가는 성질",
    correct: ["일치성"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message:
      "정규분포에서 표본분산인 $S^2$ 은 ___ 추정량이고, 최대가능도추정량인 $hat{sigma}^2$ 는 ___ 추정량이다.",
    correct: ["불편", "편의"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "$hat{sigma}$ 이 ___ 이라는 가정 하에서 그 효율성은 ___ 이다.",
    correct: ["불편추정량", "역수"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "___ : 제1종 오류를 범할 확률의 최대 한계",
    correct: ["유의수준"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "___ : 제1종 오류를 범할 확률의 최대 한계",
    correct: ["유의수준"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "확률밀도(질량)함수의 아래 넓이의 합은?",
    correct: ["1"],
    tags: ["수리통계학"],
  },
  {
    type: "short_order",
    message: "두 확률변수가 서로 독립일 때 상관계수 값은 ___ 이다",
    correct: ["0"],
    tags: ["수리통계학"],
  },
];
