import type { Dayjs } from "dayjs";
import type { RefObject } from "react";
import type { BaseEditor, Descendant } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";
import type { ITag } from "~/types";

export type ParagraphElement = {
  type: "paragraph";
  children: (CustomElement | CustomText)[];
};

// TODO: Blank Element 내부에 CustomText만 들어가는 검사 추가해야 함
export type BlankElement = {
  type: "blank";
  children: CustomText[];
};

export type CustomElement = ParagraphElement | BlankElement;

export type CustomText = { text: string; bold?: true };

declare module "slate" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export interface IBaseQuestion {
  id: string;
  message: string;
  descendants?: Descendant[];
  weight?: number;
  ignoreWhitespace?: boolean;
}

export interface IShortQuestion extends IBaseQuestion {
  type: "short";
  correct: string;
}

// 답이 여러개이고, 순서가 중요함. ", " 등으로 구분함.
export interface IShortOrderQuestion extends IBaseQuestion {
  type: "short_order";
  corrects: string[];
}

export interface IShortMultiAnswerQuestion extends IBaseQuestion {
  type: "short_multi";
  corrects: string[];
}

export interface IPickOrderQuestion extends IBaseQuestion {
  type: "pick_order";
  corrects: string[];
  otherChoices?: string[];
}

export interface IPickQuestion extends IBaseQuestion {
  type: "pick";
  correct: string;
  options: string[];
}

export interface IPickMultiQuestion extends IBaseQuestion {
  type: "pick_multi";
  corrects: string[];
  options: string[];
}

/** unused */
export interface IPickDifferentQuestion extends IBaseQuestion {
  type: "pick_different";
  pool: string[][];
}

export type QuestionContent =
  | IShortQuestion
  | IShortOrderQuestion
  | IShortMultiAnswerQuestion
  | IPickDifferentQuestion
  | IPickQuestion
  | IPickMultiQuestion
  | IPickOrderQuestion;

export interface IBaseProcessedArgs {
  given: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISuccessArgs extends IBaseProcessedArgs {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFailArgs extends IBaseProcessedArgs {}

export type QuestionInputProps<T extends QuestionContent = QuestionContent> = {
  question: T;
  disabled?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement> | RefObject<HTMLInputElement>;
  antdInputRef?: RefObject<any>;
  onSuccess?: (args: ISuccessArgs) => void;
  onFail?: (args: IFailArgs) => void;
};

export type Question = {
  id: number;
  originalId: number | null;
  content: QuestionContent;
  publicId: string;
  updatedAt: Dayjs;
  createdAt: Dayjs;
  deletedAt: Dayjs | null;
  tags: ITag[];
};

export type QuestionRaw = {
  content: string;
  publicId: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
  tags: ITag[];
};
