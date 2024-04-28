import type { Descendant } from "slate";
import type { BlankElement } from "./types";

export function getIdFromPath(path: number[]) {
  return path.join("-");
}

export function getCorrectFromBlank(blank: BlankElement) {
  return blank.children.map((leaf) => leaf.text).join("");
}

export function getBlankByPath(
  descendants: Descendant[],
  path: number[]
): BlankElement | null {
  let current: Descendant = { type: "paragraph", children: descendants };

  for (const index of path) {
    if (!("children" in current)) {
      return null;
    }

    const next: Descendant | undefined = current.children?.[index];

    if (!next) {
      return null;
    }

    current = next;
  }

  if (!("type" in current)) {
    return null;
  }

  if (current.type !== "blank") {
    return null;
  }

  return current;
}
