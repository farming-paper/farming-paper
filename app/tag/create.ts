import { nanoid } from "nanoid";
import type { ITag } from "~/types";

export function createTag(arg?: Partial<ITag>): ITag {
  return {
    name: "",
    publicId: nanoid(),
    ...arg,
  };
}
