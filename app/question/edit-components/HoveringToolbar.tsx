import { RectangleHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor, Element, Range, Transforms } from "slate";
import { useFocused, useSlate } from "slate-react";
import { twMerge } from "tailwind-merge";
import useThrottleFunc from "~/common/hooks/use-throttle-func";
import { type BlankElement } from "../slate";

const unwrapBlank = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "blank",
  });
};

const wrapBlankWithSelection = (editor: Editor) => {
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

const isBlankActive = (editor: Editor) => {
  const [blank] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "blank",
  });
  return !!blank;
};

const setStyle = (el: HTMLElement, rect: DOMRect) => {
  el.style.opacity = "1";
  el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 15}px`;
  el.style.left = `${rect.left + window.scrollX}px`;
};

export default function HoveringToolbar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();
  const setStyleThrottled = useThrottleFunc(setStyle, 300);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    const domSelection = window.getSelection();

    if (
      !selection ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === "" ||
      !inFocus ||
      !domSelection ||
      !domSelection?.anchorNode
    ) {
      el.removeAttribute("style");
      return;
    }

    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setStyleThrottled(el, rect);
  });

  const isActive = isBlankActive(editor);

  return createPortal(
    <div
      ref={ref}
      className="text-sm rounded absolute z-10 opacity-0 transition-opacity top-[-10000px] left-[-10000px] bg-white shadow-xl border"
    >
      <button
        type="button"
        className={twMerge(
          "p-1 transition rounded hover:bg-gray-100 inline-flex items-center",
          isActive && "text-primary-500"
        )}
        onPointerDown={(e) => {
          e.preventDefault();
        }}
        onClick={() => {
          isBlankActive(editor)
            ? unwrapBlank(editor)
            : wrapBlankWithSelection(editor);
        }}
      >
        <RectangleHorizontal className="w-4 h-4 mr-1" />
        <span>빈칸</span>
      </button>
    </div>,
    document.body,
    "hovering-toolbar"
  );
}
