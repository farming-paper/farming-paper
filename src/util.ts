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
  // return `${chunk(problemMessage).join("\n")}\n`;
  return problemMessage + "\n";
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
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result;
}
