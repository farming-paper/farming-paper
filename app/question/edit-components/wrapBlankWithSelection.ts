import { Editor, Range, Transforms } from "slate";
import type { BlankElement } from "../types";

export const wrapBlankWithSelection = (editor: Editor) => {
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  if (isCollapsed || !selection) {
    return;
  }

  // 영역에서 왼쪽과 오른쪽의 공백을 제거합니다.
  const str = Editor.string(editor, selection);
  const leftSpace = str.match(/^\s+/)?.[0].length ?? 0;
  const rightSpace = str.match(/\s+$/)?.[0].length ?? 0;

  if (leftSpace === str.length) {
    return;
  }

  Transforms.setSelection(editor, {
    anchor: {
      path: selection.anchor.path,
      offset: selection.anchor.offset + leftSpace,
    },
    focus: {
      path: selection.focus.path,
      offset: selection.focus.offset - rightSpace,
    },
  });

  const blankElement: BlankElement = {
    type: "blank",
    children: [],
  };
  Transforms.wrapNodes(editor, blankElement, { split: true });
};
