import { Question } from "./types";

export const problems: Question[] = [
  {
    type: "short",
    message:
      "생산자가 어떤 상품을 한 단위 더 생산하고자 할 때 받고자 하는 가장 낮은 가격",
    correct: "한계수용의사금액",
  },
  {
    type: "short",
    message:
      "소비자가 어떤 상품을 한 단위 더 소비하고자 할 때 지불 하고자 하는 가장 높은 가격",
    correct: "한계지불의사금액",
  },
  {
    type: "short_order",
    message: "한계지불의사금액은 ___곡선의 ___",
    corrects: ["수요", "높이"],
  },
  {
    type: "short_order",
    message: "한계수용의사금액은 ___곡선의 ___",
    corrects: ["공급", "높이"],
  },
  {
    type: "short",
    message:
      "생산자의 한계수용의사금액과 시장에서의 실제 가격과의 차이에서 발생하는 생산자의 이득",
    correct: "생산자잉여",
  },
  {
    type: "short",
    message:
      "소비자의 한계지불의사금액과 시장에서의 실제 지불 가격과의 차이에서 발생하는 소비자의 이득",
    correct: "소비자잉여",
  },
  {
    type: "short",
    message:
      "가격수용자, 동질적 상품, 완전한 정보, 진입장벽의 부재라는 가정을 만족하는 가상의 시장형태",
    correct: "완전경쟁시장",
  },
  {
    type: "short",
    message:
      "다른 조건이 변하지 않을 때, 한 재화의 가격이 상승하면 그 재화의 수요량이 ___한다.",
    correct: "감소",
  },
  {
    type: "short",
    message:
      "다른 조건이 변하지 않을 때, 한 재화의 가격이 상승하면 그 재화의 공급량이 ___한다.",
    correct: "증가",
  },
  {
    type: "short_multi",
    message: "완전경쟁시장의 네 가지 조건",
    corrects: ["가격수용자", "동질적 상품", "완전한 정보", "진입장벽의 부재"],
  },
  {
    type: "short",
    message:
      "시간의 변화를 고려하지 않고 한 균형 상태와 다른 균형 상태를 비교하는 것으로, 수요와 공급의 변화로 인한 균형 가격과 균형 거래량의 변화를 확인하는 방법이다.",
    correct: "비교정태분석",
  },
];
