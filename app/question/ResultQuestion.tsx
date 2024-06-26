import { atom, useAtom } from "jotai";
import { createContext, useContext, useEffect } from "react";
import type { Descendant, Text } from "slate";
import { twMerge } from "tailwind-merge";
import { useQuestion } from "./context";
import type { BlankElement, ParagraphElement } from "./types";
import { getCorrectFromBlank, getIdFromPath } from "./utils";

function ResultParagraph({
  children,
}: {
  element: ParagraphElement;
  path: number[];
  children?: React.ReactNode;
}) {
  return <p className="mb-2">{children}</p>;
}

const styleContext = createContext<{
  correctClassname?: string;
}>({});

function useStyleContext() {
  return useContext(styleContext);
}

function ResultBlank({
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
  const { correctClassname } = useStyleContext();

  return typeof incorrectSubmission === "string" ? (
    <>
      <span className="text-red-300 line-through">{incorrectSubmission}</span>
      <span className="font-bold text-red-500">{correctSubmission}</span>
    </>
  ) : (
    <span className={twMerge("font-bold text-primary-500", correctClassname)}>
      {correctSubmission}
    </span>
  );
}

const ResultText = ({ leaf }: { leaf: Text }) => {
  return <span>{leaf.text}</span>;
};

function ResultDescendant({
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

function useIncorrectSubmissionMap() {
  const [incorrects] = useAtom(incorrectsAtom);
  return incorrects;
}

export default function ResultQuestion({
  incorrects,
  correctClassname,
}: {
  incorrects: {
    pathStr: string;
    expect: string;
    actual: string;
  }[];
  correctClassname?: string;
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

  return (
    <styleContext.Provider value={{ correctClassname }}>
      {question.content.descendants?.map((descendant, index) => (
        <ResultDescendant key={index} descendant={descendant} path={[index]} />
      ))}
    </styleContext.Provider>
  );
}
