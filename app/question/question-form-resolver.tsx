import type { FieldErrors, Resolver } from "react-hook-form";
import type { ITag, PartialDeep } from "~/types";
import type { Question } from "./types";

export type QuestionFormValues = {
  question?: PartialDeep<Question>;
  tags?: PartialDeep<ITag[]>;
};

const questionFormResolver: Resolver<QuestionFormValues> = async (values) => {
  const errors: FieldErrors<QuestionFormValues> = {};

  if (!values.question?.message) {
    errors.question = {
      type: "required",
      message: "필수 입력입니다.",
    };
  }

  const hasError = Object.keys(errors).length > 0;

  return {
    values: !hasError ? values : {},
    errors,
  };
};

export default questionFormResolver;
