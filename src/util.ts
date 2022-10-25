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

export function getPromptsMessage(problemMessage: string) {
  return `${chunk(problemMessage).join("\n")}\n`;
}
