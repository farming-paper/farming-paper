import { Form, useSubmit } from "@remix-run/react";
import { isKeyHotkey } from "is-hotkey";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { isBlankActive } from "./isBlankActive";
import { unwrapBlank } from "./unwrapBlank";
import { wrapBlankWithSelection } from "./wrapBlankWithSelection";

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
        "rounded bg-gray-100 border-2 border-transparent font-medium text-black -mx-[2px] -my-[2px] transition",
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
      return (
        <p {...attributes} className={twMerge("mb-2")}>
          {children}
        </p>
      );
  }
};

const TextComponent = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;

  return (
    <span
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
  number,
  toolbar,
  className,
  style,
}: {
  autoSave?: boolean;
  onContentChange?: (content: QuestionContent) => void;
  toolbar?: React.ReactNode;
  number?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const question = useQuestion();
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );

  const formRef = useRef<HTMLFormElement>(null);
  const onContentChangeRef = useRef(onContentChange);
  const submit = useSubmit();

  const converted = useMemo(
    () => convertMarkdownToDescendants(question.content.message || ""),
    [question.content.message]
  );

  const [value, setValue] = useState(() =>
    question.content.descendants ? question.content.descendants : converted
  );

  const questionContent = useMemo<QuestionContent>(() => {
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

  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);

  useEffect(() => {
    if (onContentChangeRef.current) {
      onContentChangeRef.current(questionContent);
    }
  }, [questionContent]);

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

    // if (isKeyHotkey("mod+enter", event.nativeEvent)) {
    //   event.preventDefault();
    //   submit(formRef.current);
    // }

    if (isKeyHotkey("mod+b", event.nativeEvent)) {
      event.preventDefault();
      isBlankActive(editor)
        ? unwrapBlank(editor)
        : wrapBlankWithSelection(editor);
    }
  };

  return (
    <div
      className={twMerge("relative", className)}
      style={
        {
          "--pe-top-padding": "0px",
          "--pe-bottom-padding": "1px",
          ...style,
        } as React.CSSProperties
      }
    >
      {toolbar && (
        <div
          className={
            "absolute top-[calc(0px+var(--pe-top-padding))] left-[max(calc((100%-700px)/2),0.5rem)] z-10"
          }
        >
          {toolbar}
        </div>
      )}
      {number && (
        <div className="absolute top-0 left-[max(calc((100%-700px)/2),0.5rem)] z-10">
          {number}
        </div>
      )}
      <Form method="post" ref={formRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onValueChange={(value) => {
            setValue(value);
            if (autoSave) {
              throttledSubmit();
            }
          }}
        >
          <ClientOnly>{() => <HoveringToolbar />}</ClientOnly>
          <Editable
            className={twMerge(
              "mx-auto focus:outline-none focus:ring-0 px-[max(calc((100%-700px)/2),0.5rem)] min-w-[700px] pt-[calc(28px+var(--pe-top-padding))] pb-[var(--pe-bottom-padding)] leading-normal"
            )}
            renderElement={ElementComponent}
            renderLeaf={TextComponent}
            placeholder="학습한 내용을 주저리주저리 써보세요."
            onKeyDown={onKeyDown}
            renderPlaceholder={(props) => (
              <span
                {...props.attributes}
                style={{}}
                className="absolute italic text-gray-300 pointer-events-none select-none"
                contentEditable={false}
              >
                {props.children}
              </span>
            )}
          />
        </Slate>
        <input
          type="hidden"
          name="content"
          value={JSON.stringify(questionContent)}
        />
        <input type="hidden" name="intent" value="update_question_content" />
        <input type="hidden" name="public_id" value={question.publicId} />
      </Form>
    </div>
  );
}
