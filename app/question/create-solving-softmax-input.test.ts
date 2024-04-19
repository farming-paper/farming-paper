import { expect, test } from "vitest";
import { createSoftmaxInputV1 } from "./create-solving-softmax-input";

test("기록이 없으면 1", () => {
  const result = createSoftmaxInputV1([]);
  expect(result).toBe(1);
});

test("금방 전에 한 번 맞추면 0.25", () => {
  const result = createSoftmaxInputV1([{ elapsed_min: 20, value: 1 }]);
  expect(result).toBeCloseTo(0.25887, 5);
});

test("3일간 세 번 맞았으면 -0.37", () => {
  const data = [
    { elapsed_min: 1440, value: 1 },
    { elapsed_min: 2880, value: 1 },
    { elapsed_min: 4320, value: 1 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(-0.36708458373, 5);
});

test("3일간 세 번 틀렸으면 0.4", () => {
  const data = [
    { elapsed_min: 1440, value: 0 },
    { elapsed_min: 2880, value: 0 },
    { elapsed_min: 4320, value: 0 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(0.37573, 5);
});

test("하루간 세 번 틀렸으면 0.15", () => {
  const data = [
    { elapsed_min: 300, value: 0 },
    { elapsed_min: 600, value: 0 },
    { elapsed_min: 900, value: 0 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(0.14568, 5);
});

test("하루간 세 번 맞았으면 -0.6", () => {
  const data = [
    { elapsed_min: 300, value: 1 },
    { elapsed_min: 600, value: 1 },
    { elapsed_min: 900, value: 1 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(-0.599261600551, 5);
});

test("일주일 전에 세 번 맞았으면 -0.2", () => {
  const data = [
    { elapsed_min: 10000, value: 1 },
    { elapsed_min: 10000, value: 1 },
    { elapsed_min: 10000, value: 1 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(-0.1943215116604, 5);
});

test("일주일 전에 세 번 틀렸으면 0.5", () => {
  const data = [
    { elapsed_min: 10000, value: 0 },
    { elapsed_min: 10000, value: 0 },
    { elapsed_min: 10000, value: 0 },
  ];
  const result = createSoftmaxInputV1(data);
  expect(result).toBeCloseTo(0.52453, 5);
});
