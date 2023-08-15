import replace from "./replace";

[
  {
    sourceEngSentence: "That's what I did!",
    word: "do",
    expectedReplaced: `That's what I ___!`,
    expectedExtractedWords: ["did"],
  },
  {
    sourceEngSentence: "This is super cat. super. what super?",
    word: "super",
    expectedReplaced: "This is ___ cat. ___. what ___?",
    expectedExtractedWords: ["super", "super", "super"],
  },
  {
    sourceEngSentence: "I am discharging you",
    word: "discharge",
    expectedReplaced: "I am ___ you",
    expectedExtractedWords: ["discharging"],
  },
  {
    sourceEngSentence: "I have discharged you",
    word: "discharge",
    expectedReplaced: "I have ___ you",
    expectedExtractedWords: ["discharged"],
  },
  {
    sourceEngSentence: "I will discharge him",
    word: "discharge",
    expectedReplaced: "I will ___ him",
    expectedExtractedWords: ["discharge"],
  },
  {
    sourceEngSentence: "I discharged you",
    word: "discharge",
    expectedReplaced: "I ___ you",
    expectedExtractedWords: ["discharged"],
  },
  {
    sourceEngSentence:
      "It was an excellent sum for the third world and a sincere demonstration that the people of Manorhamilton have a burning desire to alleviate the poverty that exists in less well off lands.",
    word: "demonstration",
    expectedReplaced:
      "It was an excellent sum for the third world and a sincere ___ that the people of Manorhamilton have a burning desire to alleviate the poverty that exists in less well off lands.",
    expectedExtractedWords: ["demonstration"],
  },
  {
    sourceEngSentence:
      "Er, well excuse me, but what's left if those areas of your game aren't up to scratch?",
    word: "what",
    expectedReplaced:
      "Er, well excuse me, but ___ is left if those areas of your game aren't up to scratch?",
    expectedExtractedWords: ["what"],
    only: false,
  },
].forEach(
  ({
    expectedReplaced,
    sourceEngSentence,
    word,
    expectedExtractedWords,
    only,
  }) => {
    (only ? test.only : test)(
      `replace ${sourceEngSentence} with ${word}`,
      () => {
        const result = replace({ sourceEngSentence, word, replacement: "___" });
        expect(result.replaced).toBe(expectedReplaced);
        expect(result.extractedWords).toStrictEqual(expectedExtractedWords);
      }
    );
  }
);
