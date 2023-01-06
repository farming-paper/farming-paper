import { nanoid } from "nanoid";
import type { ITag, PartialDeep } from "~/types";

export function createTag(arg?: PartialDeep<ITag>): ITag {
  return {
    name: "",
    publicId: nanoid(),
    ...arg,
  };
}
