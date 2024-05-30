import { disassembleHangul } from "@toss/hangul";
import dayjsLib from "dayjs";
import "dayjs/locale/ko.js"; // import locale
import relativeTime from "dayjs/plugin/relativeTime.js"; // import plugin
import rfdc from "rfdc";

dayjsLib.extend(relativeTime); // use plugin
dayjsLib.locale("ko"); // use locale

export const deepclone = rfdc();

type NullRemoved<T> = T extends null
  ? undefined
  : T extends Array<infer U>
  ? Array<NullRemovedArrayItem<U>>
  : T extends object
  ? { [P in keyof T]: NullRemoved<T[P]> }
  : T;

type NullRemovedArrayItem<T> = T extends null ? null : NullRemoved<T>;

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

function bigintToNumber(n: bigint) {
  return Number(n.toString());
}

type BigIntToNumber<T extends Record<string, unknown>> = {
  [key in keyof T]: T[key] extends bigint
    ? number
    : T[key] extends bigint | null
    ? number | null
    : T[key];
};

export function getObjBigintToNumber<T extends Record<string, unknown>>(
  obj: T
): BigIntToNumber<T> {
  const result = { ...obj } as BigIntToNumber<T>;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "bigint") {
      Object.assign(result, { [key]: bigintToNumber(value) });
    }
  });

  return result;
}

export function filterByContainsHangul<T extends { name: string }>(
  items: T[],
  query: string
) {
  return items.filter((item) =>
    disassembleHangul(item.name)
      .replace(/ /g, "")
      .includes(disassembleHangul(query).replace(/ /g, ""))
  );
}
