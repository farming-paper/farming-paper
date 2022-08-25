export type Category = "1" | "2" | "3";
export type Tag = `${number}일차`;

export interface BaseProblem {
  weight?: number;
  category?: Category;
  tags?: Tag[];
}

export interface ShortProblem extends BaseProblem {
  type: "SHORT";
  q: string;
  correctA: string;
}

// 답이 여러개이고, 순서가 중요함. ", " 등으로 구분함.
export interface ShortOrderProblem extends BaseProblem {
  type: "SHORT_ORDER";
  q: string;
  correctA: string[];
}

export interface ShortMultiAnswerProblem extends BaseProblem {
  type: "SHORT_MULTI";
  q: string;
  correctA: string[];
}

export interface PickProblem extends BaseProblem {
  type: "PICK";
  q: string;
  correctA: string;
  wrongAs: string[];
}

export interface PickDifferentProblem extends BaseProblem {
  type: "PICK_DIFFERENT";
  q: string;
  pool: string[][];
}

export type Problem =
  | ShortProblem
  | ShortOrderProblem
  | ShortMultiAnswerProblem
  | PickDifferentProblem
  | PickProblem;
