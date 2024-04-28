import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { getIdFromPath } from "./utils";

const _forType = atom("");

export type SolveBlankAtomType = typeof _forType;

const blankMapAtom = atom<
  Record</** correct */ string, /** user input */ SolveBlankAtomType>
>({});

const blankSubmissionMapAtom = atom<
  Record</** id based path */ string, /** user input */ string>
>({});

export const useGetBlankAtom = () => {
  const [blankMap, setBlankMap] = useAtom(blankMapAtom);

  const getBlankAtom = useCallback(
    (correct: string) => {
      const blank = blankMap[correct];

      if (blank) {
        return blank;
      }

      const newBlank = atom("");
      setBlankMap((prev) => ({ ...prev, [correct]: newBlank }));
      return newBlank;
    },

    [setBlankMap, blankMap]
  );

  return getBlankAtom;
};

export const useBlankSubmissionMap = () => {
  const [blankSubmissionMap] = useAtom(blankSubmissionMapAtom);

  return blankSubmissionMap;
};

export const useSetBlankSubmission = () => {
  const [_, setBlankSubmissionMap] = useAtom(blankSubmissionMapAtom);

  const setBlankSubmission = useCallback(
    (path: number[], submission: string) => {
      setBlankSubmissionMap((prev) => ({
        ...prev,
        [getIdFromPath(path)]: submission,
      }));
    },
    [setBlankSubmissionMap]
  );

  return setBlankSubmission;
};

export function useBlankAtom(correct: string) {
  const getBlankAtom = useGetBlankAtom();
  return useAtom(getBlankAtom(correct));
}
