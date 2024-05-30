import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const _forType = atom("");

type SolveBlankAtomType = typeof _forType;

const blankMapAtom = atom<
  Record</** correct */ string, /** user input */ SolveBlankAtomType>
>({});

const blankSubmissionMapAtom = atom<
  Record</** id based path */ string, /** user input */ string>
>({});

const useGetBlankAtom = () => {
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
    (id: string, submission: string) => {
      setBlankSubmissionMap((prev) => ({
        ...prev,
        [id]: submission,
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
