import replace from "./replace";

[
  {
    sourceEngSentence: "That's what I did!",
    word: "do",
    expected: `That's what I ___!`,
  },
  {
    sourceEngSentence: "That's what I did!",
    word: "do",
    expected: `That's what I ___!`,
  },
  {
    sourceEngSentence: "I am discharging you",
    word: "discharge",
    expected: "I am ___ you",
  },
  {
    sourceEngSentence: "I have discharged you",
    word: "discharge",
    expected: "I have ___ you",
  },
  {
    sourceEngSentence: "I will discharge him",
    word: "discharge",
    expected: "I will ___ him",
  },
  {
    sourceEngSentence: "I discharged you",
    word: "discharge",
    expected: "I ___ you",
  },
  {
    sourceEngSentence:
      "It was an excellent sum for the third world and a sincere demonstration that the people of Manorhamilton have a burning desire to alleviate the poverty that exists in less well off lands.",
    word: "demonstration",
    expected:
      "It was an excellent sum for the third world and a sincere ___ that the people of Manorhamilton have a burning desire to alleviate the poverty that exists in less well off lands.",
  },
].forEach(({ expected, sourceEngSentence, word }) => {
  test(`replace ${sourceEngSentence} with ${word}`, () => {
    const result = replace({ sourceEngSentence, word, replacement: "___" });
    expect(result).toBe(expected);
  });
});
