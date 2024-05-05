import { atom, useAtom } from "jotai";

export const headerHeight = atom(0);

export const useHeaderHeight = () => {
  return useAtom(headerHeight);
};
