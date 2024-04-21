import { nanoid } from "nanoid";
import type { Json } from "~/supabase/generated/supabase-types";
import type {
  IPickDifferentQuestion,
  IPickMultiQuestion,
  IPickOrderQuestion,
  IPickQuestion,
  IShortMultiAnswerQuestion,
  IShortOrderQuestion,
  IShortQuestion,
  QuestionContent,
} from "./types";

export function createQuestionContent(
  args?: Partial<QuestionContent>
): QuestionContent {
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

export function createQuestionFromJson(json: Json): QuestionContent {
  return createQuestionContent(json as unknown as Partial<QuestionContent>);
}

export function removeUndefined<T>(tags?: (T | undefined)[]): T[] {
  return tags?.filter((tag): tag is T => Boolean(tag)) || [];
}

export function createShortQuestion(
  args?: Partial<IShortQuestion>
): IShortQuestion {
  return {
    id: nanoid(),
    correct: "",
    ...args,
    type: "short",
    message: args?.message || "",
  };
}

export function createShortOrderQuestion(
  args?: Partial<IShortOrderQuestion>
): IShortOrderQuestion {
  return {
    id: nanoid(),
    ...args,
    type: "short_order",
    message: args?.message || "",
    corrects: removeUndefined(args?.corrects),
    descendants: args?.descendants || [
      { type: "paragraph", children: [{ text: "" }] },
    ],
  };
}

export function createShortMultiAnswerQuestion(
  args?: Partial<IShortMultiAnswerQuestion>
): IShortMultiAnswerQuestion {
  return {
    id: nanoid(),
    ...args,
    type: "short_multi",
    message: args?.message || "",
    corrects: removeUndefined(args?.corrects),
  };
}

export function createPickOrderQuestion(
  args?: Partial<IPickOrderQuestion>
): IPickOrderQuestion {
  return {
    id: nanoid(),
    ...args,
    type: "pick_order",
    message: args?.message || "",
    corrects: removeUndefined(args?.corrects),
    otherChoices: removeUndefined(args?.otherChoices),
  };
}

export function createPickQuestion(
  args?: Partial<IPickQuestion>
): IPickQuestion {
  return {
    id: nanoid(),
    correct: "",
    ...args,
    type: "pick",
    message: args?.message || "",
    options: removeUndefined(args?.options),
  };
}

export function createPickMultiQuestion(
  args?: Partial<IPickMultiQuestion>
): IPickMultiQuestion {
  return {
    id: nanoid(),
    ...args,
    type: "pick_multi",
    message: args?.message || "",
    options: removeUndefined(args?.options),
    corrects: removeUndefined(args?.corrects),
  };
}

export function createPickDifferentQuestion(
  args?: Partial<IPickDifferentQuestion>
): IPickDifferentQuestion {
  return {
    id: nanoid(),
    ...args,
    type: "pick_different",
    message: args?.message || "",
    pool: removeUndefined(args?.pool?.map((p) => removeUndefined(p))),
    // tags: removeUndefined(args?.tags),
  };
}
