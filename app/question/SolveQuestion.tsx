import { Input } from "@nextui-org/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Descendant, Text } from "slate";
import { useBlankAtom, useSetBlankSubmission } from "./SolveQuestionAtom";
import { useQuestion } from "./context";
import type { BlankElement, ParagraphElement } from "./types";
import { getCorrectFromBlank, getIdFromPath } from "./utils";

export function SolveParagraph({
  children,
}: {
  element: ParagraphElement;
  path: number[];
  children?: React.ReactNode;
}) {
  return <div className="mb-2">{children}</div>;
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
  const id = getIdFromPath(path);
  const ids = useContext(idsContext);
  const isLast = ids[ids.length - 1] === id;
  const isFirst = ids[0] === id;
  const currentIndex = ids.indexOf(id);

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
    return width * 1.2;
  }, [element.children]);

  useEffect(() => {
    if (typeof value === "string") {
      setBlankSubmission(id, value);
    }
  }, [id, setBlankSubmission, value]);

  return isClient ? (
    <div
      className="inline-block mx-0.5 -mt-0.5 align-top"
      style={{
        width: `calc(${width}px + 1rem)`,
      }}
    >
      <Input
        size="sm"
        value={value}
        classNames={{
          input: "text-base  ",
          inputWrapper:
            "group-data-[focus=true]:border-primary-500 h-7 min-h-7",
        }}
        data-blank-id={id}
        autoFocus={isFirst}
        variant="bordered"
        onValueChange={(v) => setValue(v)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            if (isLast) {
              const solveSubmitButton = document.querySelector(
                "#solve_submit_button[type=submit]"
              ) as HTMLButtonElement | null;
              solveSubmitButton?.click();
            } else {
              const nextId = ids[currentIndex + 1];
              const nextInput = document.querySelector(
                `input[data-blank-id="${nextId}"]`
              ) as HTMLInputElement | null;
              nextInput?.focus();
            }
          }
        }}
        isRequired
      />
    </div>
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

// traverse the question content and collect all the ids of the blanks
function collectIds(descendant: Descendant, path: number[]): string[] {
  if ("type" in descendant) {
    switch (descendant.type) {
      case "paragraph":
        return descendant.children.flatMap((descendant, index) => {
          return collectIds(descendant, [...path, index]);
        });
      case "blank":
        return [getIdFromPath(path)];
    }
  }
  return [];
}

const idsContext = createContext<string[]>([]);

export default function SolveQuestion() {
  const question = useQuestion();
  // traverse the question content and collect all the ids of the blanks
  const ids = useMemo(() => {
    return (
      question.content.descendants?.flatMap((descendant, index) =>
        collectIds(descendant, [index])
      ) ?? []
    );
  }, [question.content.descendants]);

  return (
    <idsContext.Provider value={ids}>
      {question.content.descendants?.map((descendant, index) => (
        <SolveDescendant key={index} descendant={descendant} path={[index]} />
      ))}
    </idsContext.Provider>
  );
}
