/**
 *
 * @param value 0 to 1. 0 is wrong, 1 is correct
 * @param diff minute difference between the time the question was asked and the time the question was answered
 */
export const createSoftmaxInputV1 = (
  data: { elapsed_min: number; value: number }[]
) => {
  let sum = 0;
  for (const { elapsed_min, value } of data) {
    // value:0 -> x:-0.2
    // value:1 -> x:-0.1
    sum += Math.pow(elapsed_min, -0.2 + 0.1 * value);
  }

  if (sum >= 1) {
    return 0;
  }

  return 1 - sum;
};
