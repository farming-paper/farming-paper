import { Editor, Element } from "slate";

export const isBlankActive = (editor: Editor) => {
  const [blank] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "blank",
  });
  return !!blank;
};
