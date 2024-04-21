import { Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import type { Descendant, Text } from "slate";
import { useBlankAtom, useSetBlankSubmission } from "./SolveQuestionAtom";
import { useQuestion } from "./context";
import type { BlankElement, ParagraphElement } from "./types";
import { getCorrectFromBlank } from "./utils";

export function SolveParagraph({
  children,
}: {
  element: ParagraphElement;
  path: number[];
  children?: React.ReactNode;
}) {
  return <div className="leading-10">{children}</div>;
}

export function SolveBlank({
  element,
  path,
}: {
  element: BlankElement;
  path: number[];
  children?: React.ReactNode;
}) {
  const [value, setValue] = useBlankAtom(getCorrectFromBlank(element));
  const setBlankSubmission = useSetBlankSubmission();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const width = useMemo(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const span = window.document.createElement("span");
    span.innerText = element.children.map((leaf) => leaf.text).join("");
    span.style.visibility = "hidden";
    span.style.position = "fixed";
    span.style.whiteSpace = "nowrap";
    window.document.body.appendChild(span);
    const width = span.offsetWidth;
    span.remove();
    return width * 2;
  }, [element.children]);

  useEffect(() => {
    if (typeof value === "string") {
      setBlankSubmission(path, value);
    }
  }, [path, setBlankSubmission, value]);

  return isClient ? (
    <Input
      size="sm"
      value={value}
      classNames={{
        input: "w-auto text-base",
        base: "w-auto inline-flex",
        inputWrapper: "w-auto",
      }}
      style={{ width: `${width}px` }}
      fullWidth={false}
      onValueChange={(v) => setValue(v)}
      isRequired
    />
  ) : null;
}

export const SolveText = ({ leaf }: { leaf: Text }) => {
  return <span>{leaf.text}</span>;
};

export function SolveDescendant({
  descendant,
  path,
}: {
  descendant: Descendant;
  path: number[];
}) {
  if ("type" in descendant) {
    switch (descendant.type) {
      case "paragraph":
        return (
          <SolveParagraph element={descendant} path={path}>
            {descendant.children.map((descendant, index) => (
              <SolveDescendant
                key={index}
                descendant={descendant}
                path={[...path, index]}
              />
            ))}
          </SolveParagraph>
        );
      case "blank":
        return (
          <SolveBlank element={descendant} path={path}>
            {descendant.children.map((descendant, index) => (
              <SolveDescendant
                key={index}
                descendant={descendant}
                path={[...path, index]}
              />
            ))}
          </SolveBlank>
        );
    }
  }
  return <SolveText leaf={descendant} />;
}

export default function SolveQuestion() {
  const question = useQuestion();

  return question.content.descendants?.map((descendant, index) => (
    <SolveDescendant key={index} descendant={descendant} path={[index]} />
  ));
}
