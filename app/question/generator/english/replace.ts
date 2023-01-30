import nlp from "compromise";
import type View from "compromise/types/view/one";

export default function replace({
  sourceEngSentence,
  word,
  replacement = "___",
}: {
  sourceEngSentence: string;
  word: string;
  replacement?: string;
}) {
  const conjuagted = nlp(word).verbs().conjugate();
  const words: string[] = Object.values(conjuagted[0] ?? {});

  // conjuated (모든 시제 구하는 함수)는 오직 동사에만 동작합니다.
  if (conjuagted.length > 0) {
    const isEndingWithE = word[word.length - 1] === "e";
    const ing = `${isEndingWithE ? word.slice(0, -1) : word}ing`;
    if (!isEndingWithE) {
      words.push(`${word}${word[word.length - 1]}ing`);
    }
    words.push(ing);
  } else {
    words.push(word);
  }

  const plural = nlp(word).nouns().toPlural().text();
  if (plural) {
    words.push(plural);
  }

  const document = nlp(sourceEngSentence);

  const prevWords: string[] = [];

  words.forEach((word) =>
    document.replace(word, (match: View) => {
      const prevWord = match.text({
        keepPunct: false, // '?!' → ?
        acronyms: false, // F.B.I. → FBI
        abbreviations: false, // Mrs. → Mrs
        implicit: true,
      });

      if (prevWord.includes("'")) {
        prevWords.push(prevWord.split("'")[0] as string); // what's → what
      } else {
        prevWords.push(prevWord);
      }

      return replacement;
    })
  );

  return {
    prevWords,
    replaced: document.text(),
  };
}
