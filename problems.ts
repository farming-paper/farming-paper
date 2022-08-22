type Category = "1" | "2" | "3";
type Tag = "1일차";

interface BaseProblem {
  weight?: number;
  category: Category;
  tags: Tag[];
}

interface ShortProblem extends BaseProblem {
  type: "SHORT";
  q: string;
  correctA: string;
}

// 답이 여러개이고, 순서가 중요함. ", " 등으로 구분함.
interface ShortOrderProblem extends BaseProblem {
  type: "SHORT_ORDER";
  q: string;
  correctA: string[];
}

interface ShortMultiAnswerProblem extends BaseProblem {
  type: "SHORT_MULTI";
  q: string;
  correctA: string[];
}

interface PickProblem extends BaseProblem {
  type: "PICK";
  q: string;
  correctA: string;
  wrongAs: string[];
}
type Problem =
  | ShortProblem
  | ShortOrderProblem
  | ShortMultiAnswerProblem
  | PickProblem;

export const problems: Problem[] = [
  {
    type: "SHORT",
    q: "데이터의 일반적인 특징 중 동일한 내용의 데이터가 중복되어 있지 않은 것",
    correctA: "통합된 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터의 일반적인 특징 중 컴퓨터의 저장매체에 있는 것.",
    correctA: "저장된 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터의 일반적인 특징 중 여러 사용자가 서로 다른 목적으로 접근할 수 있는 것",
    correctA: "공용 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터의 일반적인 특징 중 새로운 데이터의 삽입, 기존 데이터의 수정, 삭제, 업데이트를 하여 항상 최신의 정확한 데이터 상태를 유지하는 것",
    correctA: "변화하는 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "학습과 체험을 통해 개인에게 습득되어 있지만 겉으로 드러나지 않는 상태의 지식",
    correctA: "암묵지",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "문서나 매뉴얼처럼 외부로 표출돼 여러 사람이 공유할 수 있는 지식",
    correctA: "형식지",
    category: "1",
    tags: ["1일차"],
  },

  {
    type: "SHORT_ORDER",
    q: "암묵지-형식지의 상호작용: 조직의 지식으로 ___를 위한 ___, 개인에게 ___ 및 습득되는 ___",
    correctA: ["공통화", "표출화", "연결", "내면화"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_ORDER",
    q: "객관적인 사실로부터 얻을 수 있는 것들을 차례대로.",
    correctA: ["데이터", "정보", "지식", "지혜"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_MULTI",
    q: "데이터베이스의 다섯가지 측면 (측면이라는 말 제외)",
    correctA: [
      "정보의 축적 및 전달",
      "정보이용",
      "정보관리",
      "정보기술발전",
      "경제 산업적",
    ],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터베이스에서 명령을 수행하는 하나의 단위",
    correctA: "트랜잭션",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_MULTI",
    q: "트랜잭션 네 가지 특성",
    correctA: ["원자성", "일관성", "고립성", "지속성"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "각각 거래 단위에 초점을 맞추는 데 목적이 있는 시스템 (예: 주문입력)",
    correctA: "OLTP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "전체 데이터를 분석하기 위한 시스템",
    correctA: "OLAP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "서비스 간 연계가 필요할 경우 중앙에서 관리를 위한 것",
    correctA: "EAI",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "기업이 보유할 수 있는 모든 지식을 통합 -> 문제 해결 능력 향상하기 위한 것",
    correctA: "KMS",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "공급을 관리하는 시스템",
    correctA: "SCM",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "고객을 관리하는 시스템",
    correctA: "CRM",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "제조 부문에서 자원에 대한 구매/생산을 효율적으로 하기 위한 시스템",
    correctA: "ERP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "제조 부문에서 기업의 의사결정 프로세스를 의미하는 것",
    correctA: "BI",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터를 설명하는 데이터",
    correctA: "메타데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "데이터를 설명하는 데이터",
    correctA: "메타데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_ORDER",
    q: "빅데이터의 특징을 이야기할 때: __의 __",
    correctA: ["더그 래니", "3V"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_MULTI",
    q: "빅데이터 특징 3V (소문자로)",
    correctA: ["volume", "variety", "velocity"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_MULTI",
    q: "3V 에 하나로 추가하는 것은 ___ 또는 ___ 이다. (햔국어로)",
    correctA: ["가치", "정확성"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT_MULTI",
    q: "빅데이터가 만들어내는 변화 네 가지",
    correctA: ["사후처리", "전수조사", "양", "상관관계"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "빅데이터는 ____의 석탄, 철! 생산성을 획기적으로 끌어올림.",
    correctA: "산업혁명",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "빅데이터는 21세기 ___! 산업 전반의 생산성을 향상시키고 새로운 범주의 산업을 만들어낼 것임!",
    correctA: "원유",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "빅데이터는 ___! 생물학에 큰 영향을 끼친 ___ 처럼 산업 발전에 큰 영향을 줄 것이다.",
    correctA: "렌즈",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "빅데이터는 ___! (여러 사람이 공동으로 사용 가능한 구조물) 예: 페이스북, 카카오톡",
    correctA: "플랫폼",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "___ 이란 헤겔의 변증법에 기초를 둔 개념으로, 양적인 변화가 축적되면 질적인 변화도 이루어진다는 개념이다.",
    correctA: "양질 전환의 법칙",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "SHORT",
    q: "___ 이란 헤겔의 변증법에 기초를 둔 개념으로, 양적인 변화가 축적되면 질적인 변화도 이루어진다는 개념이다.",
    correctA: "양질 전환의 법칙",
    category: "1",
    tags: ["1일차"],
  },
];
