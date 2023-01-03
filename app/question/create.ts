import type { PartialDeep } from "type-fest";
import type {
  IPickDifferentQuestion,
  IPickMultiQuestion,
  IPickOrderQuestion,
  IPickQuestion,
  IShortMultiAnswerQuestion,
  IShortOrderQuestion,
  IShortQuestion,
  Question,
} from "./types";

export function createQuestion(args?: PartialDeep<Question>): Question {
  switch (args?.type) {
    case "pick_different":
      return createPickDifferentQuestion(args);
    case "pick_multi":
      return createPickMultiQuestion(args);
    case "pick_order":
      return createPickOrderQuestion(args);
    case "pick":
      return createPickQuestion(args);
    case "short_multi":
      return createShortMultiAnswerQuestion(args);
    case "short_order":
      return createShortOrderQuestion(args);
    case "short":
      return createShortQuestion(args);
    default:
      throw new Error("Invalid question type");
  }
}

export function createShortQuestion(
  args?: PartialDeep<IShortQuestion>
): IShortQuestion {
  return {
    correct: "",
    ...args,
    type: "short",
    message: args?.message || "",
  };
}

export function createShortOrderQuestion(
  args?: PartialDeep<IShortOrderQuestion>
): IShortOrderQuestion {
  return {
    corrects: [],
    ...args,
    type: "short_order",
    message: args?.message || "",
  };
}

export function createShortMultiAnswerQuestion(
  args?: PartialDeep<IShortMultiAnswerQuestion>
): IShortMultiAnswerQuestion {
  return {
    corrects: [],
    ...args,
    type: "short_multi",
    message: args?.message || "",
  };
}

export function createPickOrderQuestion(
  args?: PartialDeep<IPickOrderQuestion>
): IPickOrderQuestion {
  return {
    corrects: [],
    ...args,
    type: "pick_order",
    message: args?.message || "",
  };
}

export function createPickQuestion(
  args?: PartialDeep<IPickQuestion>
): IPickQuestion {
  return {
    correct: "",
    ...args,
    type: "pick",
    message: args?.message || "",
    options: args?.options || [],
  };
}

export function createPickMultiQuestion(
  args?: PartialDeep<IPickMultiQuestion>
): IPickMultiQuestion {
  return {
    corrects: [],
    ...args,
    type: "pick_multi",
    message: args?.message || "",
    options: args?.options || [],
  };
}

export function createPickDifferentQuestion(
  args?: PartialDeep<IPickDifferentQuestion>
): IPickDifferentQuestion {
  return {
    pool: [],
    ...args,
    type: "pick_different",
    message: args?.message || "",
  };
}
