import { Form, useSubmit } from "@remix-run/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Editor, Element } from "slate";
import { createEditor } from "slate";
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

  // editor.isElementReadOnly = (element) =>
  //   element.type === "badge" || isElementReadOnly(element);

  // editor.isSelectable = (element) =>
  //   element.type !== "badge" && isSelectable(element);

  // editor.insertText = (text) => {
  //   if (text && isUrl(text)) {
  //     wrapLink(editor, text);
  //   } else {
  //     insertText(text);
  //   }
  // };

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
        "px-1.5 py-0.5 rounded border",
        selected ? "bg-gray-100" : ""
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

export default function ParagrahEditor() {
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

  return (
    <Form method="post" ref={formRef}>
      <Slate
        editor={editor}
        initialValue={value}
        onValueChange={(value) => {
          setValue(value);
          throttledSubmit();
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
          placeholder="학습한 내용을 주저리주저리 써보시게나."
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

          // onKeyDown={onKeyDown}
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
