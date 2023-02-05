import type { FetcherWithComponents, SubmitOptions } from "@remix-run/react";
import { useFetcher, useSubmit } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import dayjsLib from "dayjs";
import "dayjs/locale/ko"; // import locale
import relativeTime from "dayjs/plugin/relativeTime"; // import plugin
import React from "react";
import rfdc from "rfdc";

dayjsLib.extend(relativeTime); // use plugin
dayjsLib.locale("ko"); // use locale

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullRemoved<T> = T extends null
  ? undefined
  : T extends Array<infer U>
  ? Array<U>
  : T extends object
  ? { [P in keyof T]: NullRemoved<T[P]> }
  : T;

// TODO: 테스트 추가
/**
 * 어떤 객체에서 `null` 을 모두 삭제합니다.
 * GraphQL 의 코드젠을 통해 생성된 타입 중 `InputMaybe` 는
 * `T | null | undefined` 등으로 처리되는데,
 * 이를 `T | undefined` 로 바꿀 때 사용됩니다.
 * 배열의 요소는 건드리지 않습니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeNullDeep = <T extends { [key: string]: any }>(
  obj: T
): NullRemoved<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = {} as any;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      result[key] = value.map((child) => {
        if (child === null) {
          return null;
        }

        if (typeof child === "object") {
          return removeNullDeep(child);
        }

        return child;
      });

      return;
    }

    if (typeof value === "object") {
      result[key] = removeNullDeep(value);
      return;
    }

    result[key] = value;
  });

  return result;
};

export async function getFormdataFromRequest<T>({
  request,
  keyName,
}: {
  request: Request;
  keyName: string;
}): Promise<T> {
  const data = Object.fromEntries(await request.formData()) as {
    [key in typeof keyName]: string;
  };

  const stringData = data[keyName];
  if (!stringData) {
    throw new Error(`No data on key ${keyName}`);
  }

  return JSON.parse(stringData) as T;
}

export async function getArgsFromRequest<T>(request: Request): Promise<T> {
  const formData = Object.fromEntries(await request.formData()) as {
    data: string;
  };

  return JSON.parse(formData.data) as T;
}

export function createFormData<T>(args: T) {
  return {
    data: JSON.stringify(args),
  };
}

export function createSubmit<TActionFunc, TArgs = Record<string, never>>() {
  return (
    fetcher: FetcherWithComponents<SerializeFrom<TActionFunc>>,
    args: TArgs,
    options?: SubmitOptions
  ) => {
    fetcher.submit(
      {
        data: JSON.stringify(args),
      },
      options
    );
  };
}

export function typedFetcher<TActionFunc, TArgs = Record<string, never>>() {
  return {
    useFetcher: useFetcher<TActionFunc>,
    getArgsFromRequest: getArgsFromRequest<TArgs>,
    createArgs: createFormData<TArgs>,
    submit: createSubmit<TActionFunc, TArgs>(),
  };
}

export function typedSubmit<TArgs = Record<string, never>>() {
  return {
    useSubmit: () => {
      const submit = useSubmit();
      return (args: TArgs, options?: SubmitOptions) => {
        submit(createFormData(args), options);
      };
    },
    getArgsFromRequest: getArgsFromRequest<TArgs>,
  };
}

export const dayjs = dayjsLib;

export async function withDurationLog<T>(
  name: string,
  promise: PromiseLike<T>,
  options: { onlyDev?: boolean } = {}
): Promise<T> {
  const { onlyDev = false } = options;
  if (onlyDev && process.env.NODE_ENV !== "development") {
    return promise;
  }
  const start = Date.now();
  const result = await promise;
  const end = Date.now();
  // eslint-disable-next-line no-console
  console.log(`[time] ${name}: ${end - start}ms`);
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noopFunction(..._args: any): any {
  // noop
}
