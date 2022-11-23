import React from "react";
import rfdc from "rfdc";

export function isSetEqual<T>(xs: Set<T>, ys: Set<T>): boolean {
  return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}

export function isBagEqual<T>(xs: T[], ys: T[]): boolean {
  return isSetEqual(new Set(xs), new Set(ys));
}

export function isArrayEqual<T>(xs: T[], ys: T[]): boolean {
  return xs.length === ys.length && xs.every((x, i) => x === ys[i]);
}

export function chunk(str: string, chunkSize = 40) {
  const result: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    const chunk = str.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

export function getPromptsMessage(questionMessage: string) {
  // return `${chunk(problemMessage).join("\n")}\n`;
  return questionMessage + "\n>>";
}

export function shuffle<T>(array: T[]) {
  const result = [...array];
  let currentIndex = result.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex] as T,
      result[currentIndex] as T,
    ];
  }

  return result;
}

export const deepclone = rfdc();

/**
 * Hook to initialize and return a constant value. Unlike `React.useMemo`, this is guaranteed to
 * always return the same value (and if the initializer is a function, only call it once).
 * This is similar to setting a private member in a class constructor.
 *
 * If the value should ever change based on dependencies, use `React.useMemo` instead.
 *
 * @param initialValue - Initial value, or function to get the initial value. Similar to `useState`,
 * only the value/function passed in the first time this is called is respected.
 * @returns The value. The identity of this value will always be the same.
 */
export function useConst<T>(initialValue: T | (() => T)): T {
  // Use useRef to store the value because it's the least expensive built-in hook that works here
  // (we could also use `const [value] = React.useState(initialValue)` but that's more expensive
  // internally due to reducer handling which we don't need)
  const ref = React.useRef<{ value: T }>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value:
        typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue,
    };
  }
  return ref.current.value;
}
