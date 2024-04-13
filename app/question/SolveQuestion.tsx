import { Input } from "@nextui-org/react";
import { atom, useAtom } from "jotai";
import { createContext, useContext } from "react";
import type { Descendant, Text } from "slate";
import { useQuestion } from "./context";
import type { BlankElement, ParagraphElement } from "./slate";

const _forType = atom("");

const solveBlankContext = createContext<{
  getBlankAtom: (id: string) => typeof _forType;
} | null>(null);

const solveBlankMapAtom = atom<Record<string, typeof _forType>>({});

export function SolveBlankProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [solveBlankMap, setSolveBlankMap] = useAtom(solveBlankMapAtom);

  const getBlankAtom = (id: string) => {
    const blank = solveBlankMap[id];
    if (blank) {
      return blank;
    }

    const newBlank = atom("");
    setSolveBlankMap((prev) => ({ ...prev, [id]: newBlank }));
    return newBlank;
  };

  return (
    <solveBlankContext.Provider
      value={{
        getBlankAtom,
      }}
    >
      {children}
    </solveBlankContext.Provider>
  );
}

export function useSolveBlankAtom(id: string) {
  const context = useContext(solveBlankContext);
  if (!context) {
    throw new Error("useSolveBlank must be used within a SolveBlankProvider");
  }
  return useAtom(context.getBlankAtom(id));
}

export function getBlankId(blank: BlankElement): string {
  return blank.children.map((leaf) => leaf.text).join("_");
}

export function SolveParagraph({
  children,
}: {
  element: ParagraphElement;
  children?: React.ReactNode;
}) {
  return <p className="leading-10">{children}</p>;
}

export function SolveBlank({
  element: blank,
}: {
  element: BlankElement;
  children?: React.ReactNode;
}) {
  const [value, setValue] = useSolveBlankAtom(getBlankId(blank));
  return (
    <Input
      size="sm"
      className="inline-flex w-40 text-base"
      value={value}
      fullWidth={false}
      onValueChange={(v) => setValue(v)}
      placeholder="정답 입력"
      isRequired
    />
  );
}

export const SolveText = ({ leaf }: { leaf: Text }) => {
  return <span>{leaf.text}</span>;
};

export function SolveDescendant({ descendant }: { descendant: Descendant }) {
  if ("type" in descendant) {
    switch (descendant.type) {
      case "paragraph":
        return (
          <SolveParagraph element={descendant}>
            {descendant.children.map((descendant, index) => (
              <SolveDescendant key={index} descendant={descendant} />
            ))}
          </SolveParagraph>
        );
      case "blank":
        return (
          <SolveBlank element={descendant}>
            {descendant.children.map((descendant, index) => (
              <SolveDescendant key={index} descendant={descendant} />
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
    <SolveDescendant key={index} descendant={descendant} />
  ));
}
