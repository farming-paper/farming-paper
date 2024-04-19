import { Form, useSubmit } from "@remix-run/react";
import { isKeyHotkey } from "is-hotkey";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Editor, Element } from "slate";
import { Range, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, useSelected, withReact } from "slate-react";
import { twMerge } from "tailwind-merge";
import { ClientOnly } from "~/common/components/ClientOnly";
import useThrottleFunc from "~/common/hooks/use-throttle-func";
import { useQuestion } from "../context";
import { convertMarkdownToDescendants } from "../slate";
import type { QuestionContent } from "../types";
import HoveringToolbar from "./HoveringToolbar";

/** @see https://github.com/ianstormtaylor/slate/blob/main/site/examples/inlines.tsx */
const withInlines = (editor: Editor) => {
  const {
    insertData,
    insertText: _1,
    isInline,
    isElementReadOnly: _2,
    isSelectable: _3,
  } = editor;

  editor.isInline = (element: Element) =>
    ["blank"].includes(element.type) || isInline(element);

  editor.insertData = (data) => {
    const _text = data.getData("text/html");

    // console.log(text);
    return insertData(data);
  };

  // editor.insertData = (data) => {
  //   const text = data.getData("text/html");

  //   if (text && isUrl(text)) {
  //     wrapLink(editor, text);
  //   } else {
  //     insertData(data);
  //   }
  // };

  return editor;
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} className="text-0">
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const BlankComponent = ({
  attributes,
  children,
  element: _element,
}: RenderElementProps) => {
  const selected = useSelected();
  return (
    <span
      {...attributes}
      className={twMerge(
        "rounded bg-gray-100 border-2 border-transparent font-medium text-black px-0.5 -my-[2px] transition",
        selected ? "border-gray-300" : ""
      )}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );
};

const ElementComponent = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "blank":
      return <BlankComponent {...props} element={element} />;
    case "paragraph":
      return <p {...attributes}>{children}</p>;
  }
};

const TextComponent = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;

  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      className={twMerge(leaf.text === "" && "pl-[0.1px]")}
      {...attributes}
    >
      {children}
    </span>
  );
};

export default function ParagrahEditor({
  autoSave = false,
  onContentChange,
}: {
  autoSave?: boolean;
  onContentChange?: (content: QuestionContent) => void;
}) {
  const question = useQuestion();
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );

  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const converted = useMemo(
    () => convertMarkdownToDescendants(question.content.message),
    [question.content.message]
  );

  const [value, setValue] = useState(() =>
    question.content.descendants ? question.content.descendants : converted
  );

  const questionContent = useMemo((): QuestionContent => {
    return {
      ...question.content,
      descendants: value,
    };
  }, [question.content, value]);

  const throttledSubmit = useThrottleFunc(
    useCallback(() => {
      submit(formRef.current);
    }, [submit]),
    3000
  );

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { selection } = editor;

    // Default left/right behavior is unit:'character'.
    // This fails to distinguish between two cursor positions, such as
    // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
    // Here we modify the behavior to unit:'offset'.
    // This lets the user step into and out of the inline without stepping over characters.
    // You may wish to customize this further to only use unit:'offset' in specific cases.
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;

      if (nativeEvent.isComposing) {
        return;
      }

      if (isKeyHotkey("left", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }
      if (isKeyHotkey("right", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset" });
        return;
      }
    }
  };

  return (
    <Form method="post" ref={formRef}>
      <Slate
        editor={editor}
        initialValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (autoSave) {
            throttledSubmit();
          }

          onContentChange?.(questionContent);
        }}
      >
        <ClientOnly>{() => <HoveringToolbar />}</ClientOnly>
        {/* <Toolbar>
        <AddLinkButton />
        <RemoveLinkButton />
        <ToggleEditableButtonButton />
      </Toolbar> */}
        <Editable
          className="focus:outline-none focus:ring-0"
          renderElement={ElementComponent}
          renderLeaf={TextComponent}
          placeholder="학습한 내용을 주저리주저리 써보세요."
          // onDOMBeforeInput={(event: InputEvent) => {
          //    console.log("event", event);
          //    switch (event.inputType) {
          //      case "formatBold":
          //        event.preventDefault();
          //        return toggleMark(editor, "bold");
          //      case "formatItalic":
          //        event.preventDefault();
          //        return toggleMark(editor, "italic");
          //      case "formatUnderline":
          //        event.preventDefault();
          //        return toggleMark(editor, "underlined");
          //    }
          // }}

          onKeyDown={onKeyDown}
        />
      </Slate>
      <input
        type="hidden"
        name="content"
        value={JSON.stringify(questionContent)}
      />
      <input type="hidden" name="intent" value="update_question_content" />
      <input type="hidden" name="public_id" value={question.publicId} />

      {/* <span>{question.publicId}</span> */}
    </Form>
  );
}
