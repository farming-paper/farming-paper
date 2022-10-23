export function isSetEqual<T>(xs: Set<T>, ys: Set<T>): boolean {
  return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}

export function isBagEqual<T>(xs: T[], ys: T[]): boolean {
  return xs.length === ys.length && xs.every((x) => ys.includes(x));
}
