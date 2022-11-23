export type Category = "1" | "2" | "3";
export type Tag = `${number}일차` | "핵심 서브노트 110제";

export interface BaseQuestion {
  message: string;
  weight?: number;
  category?: Category;
  tags?: Tag[];
}

export interface ShortQuestion extends BaseQuestion {
  type: "short";
  correct: string;
}

// 답이 여러개이고, 순서가 중요함. ", " 등으로 구분함.
export interface ShortOrderQuestion extends BaseQuestion {
  type: "short_order";
  correct: string[];
}

export interface ShortMultiAnswerQuestion extends BaseQuestion {
  type: "short_multi";
  correct: string[];
}

export interface PickQuestion extends BaseQuestion {
  type: "pick";
  correct: string;
  wrongs: string[];
}

export interface PickDifferentQuestion extends BaseQuestion {
  type: "pick_different";
  pool: string[][];
}

export type Question =
  | ShortQuestion
  | ShortOrderQuestion
  | ShortMultiAnswerQuestion
  | PickDifferentQuestion
  | PickQuestion;

export interface ISuccessArgs {}

export interface IFailArgs {}

export type QuestionInputProps<T extends Question = Question> = {
  question: T;
  onSuccess?: (args?: ISuccessArgs) => void;
  onFail?: (args?: IFailArgs) => void;
};
