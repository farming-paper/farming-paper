import { getRandomValues } from "node:crypto";

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b);
  return exps.map((x) => x / sum);
}

export function randomIndexBasedOnSoftmax(arr: number[]) {
  const probabilities = softmax(arr);
  const cumulativeProbabilities = probabilities.reduce((acc, prob, index) => {
    if (index === 0) {
      return [prob];
    }
    return [...acc, prob + acc[index - 1]!];
  }, [] as number[]);

  const random = getRandomValues(new Uint32Array(1))[0]! / 2 ** 32;

  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (random < cumulativeProbabilities[i]!) {
      return i;
    }
  }

  return cumulativeProbabilities.length - 1;
}
