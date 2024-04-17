import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import type { Descendant, Text } from "slate";
import { useQuestion } from "./context";
import type { BlankElement, ParagraphElement } from "./types";
import { getCorrectFromBlank, getIdFromPath } from "./utils";

export function ResultParagraph({
  children,
}: {
  element: ParagraphElement;
  path: number[];
  children?: React.ReactNode;
}) {
  return <p>{children}</p>;
}

export function ResultBlank({
  element,
  path,
}: {
  element: BlankElement;
  path: number[];
  children?: React.ReactNode;
}) {
  const incorrects = useIncorrectSubmissionMap();
  const incorrectSubmission = incorrects.get(getIdFromPath(path));
  const correctSubmission = getCorrectFromBlank(element);

  return typeof incorrectSubmission === "string" ? (
    <>
      <span className="text-red-300 line-through">{incorrectSubmission}</span>
      <span className="font-bold text-red-500">{correctSubmission}</span>
    </>
  ) : (
    <span className="font-bold text-primary-500">{correctSubmission}</span>
  );
}

export const ResultText = ({ leaf }: { leaf: Text }) => {
  return <span>{leaf.text}</span>;
};

export function ResultDescendant({
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
          <ResultParagraph element={descendant} path={path}>
            {descendant.children.map((descendant, index) => (
              <ResultDescendant
                key={index}
                descendant={descendant}
                path={[...path, index]}
              />
            ))}
          </ResultParagraph>
        );
      case "blank":
        return (
          <ResultBlank element={descendant} path={path}>
            {descendant.children.map((descendant, index) => (
              <ResultDescendant
                key={index}
                descendant={descendant}
                path={[...path, index]}
              />
            ))}
          </ResultBlank>
        );
    }
  }
  return <ResultText leaf={descendant} />;
}

const incorrectsAtom = atom<Map<string, string>>(new Map());

export function useIncorrectSubmissionMap() {
  const [incorrects] = useAtom(incorrectsAtom);
  return incorrects;
}

export default function ResultQuestion({
  incorrects,
}: {
  incorrects: {
    pathStr: string;
    expect: string;
    actual: string;
  }[];
}) {
  const question = useQuestion();
  const [, setIncorrects] = useAtom(incorrectsAtom);

  useEffect(() => {
    const map = new Map<string, string>();
    for (const { pathStr, expect: _, actual } of incorrects) {
      map.set(pathStr, actual);
    }
    setIncorrects(map);
  }, [incorrects, setIncorrects]);

  return question.content.descendants?.map((descendant, index) => (
    <ResultDescendant key={index} descendant={descendant} path={[index]} />
  ));
}
