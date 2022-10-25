export type Category = "1" | "2" | "3";
export type Tag = `${number}일차` | "핵심 서브노트 110제";

export interface BaseProblem {
  message: string;
  weight?: number;
  category?: Category;
  tags?: Tag[];
}

export interface ShortQuestion extends BaseProblem {
  type: "short";
  correct: string;
}

// 답이 여러개이고, 순서가 중요함. ", " 등으로 구분함.
export interface ShortOrderQuestion extends BaseProblem {
  type: "short_order";
  corrects: string[];
}

export interface ShortMultiAnswerQuestion extends BaseProblem {
  type: "short_multi";
  corrects: string[];
}

export interface PickQuestion extends BaseProblem {
  type: "pick";
  correct: string;
  wrongAs: string[];
}

export interface PickDifferentQuestion extends BaseProblem {
  type: "pick_different";
  pool: string[][];
}

export type Question =
  | ShortQuestion
  | ShortOrderQuestion
  | ShortMultiAnswerQuestion
  | PickDifferentQuestion
  | PickQuestion;
