import type { FieldErrors, Resolver } from "react-hook-form";
import type { ITag } from "~/types";
import type { QuestionContent } from "./types";

export type QuestionFormValues = {
  question?: Partial<QuestionContent>;
  tags?: Partial<ITag[]>;
};

const questionFormResolver: Resolver<QuestionFormValues> = async (values) => {
  const errors: FieldErrors<QuestionFormValues> = {};

  if (!values.question?.message) {
    errors.question = {
      // TODO: 기능 테스트
      root: {
        type: "required",
        message: "필수 입력입니다.",
      },
    };
  }

  const hasError = Object.keys(errors).length > 0;

  return {
    values: !hasError ? values : {},
    errors,
  };
};

export default questionFormResolver;
