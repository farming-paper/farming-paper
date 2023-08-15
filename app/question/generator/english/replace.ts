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

  const extractedWords: string[] = [];

  words.forEach((word) =>
    document.replace(word, (match: View) => {
      let extractedWord = match.text({
        keepPunct: false, // '?!' → ?
        acronyms: false, // F.B.I. → FBI
        abbreviations: false, // Mrs. → Mrs
      });

      if (extractedWord.includes("'")) {
        extractedWord = extractedWord.split("'")[0] as string;
      }

      extractedWord = extractedWord.replace(/[^a-zA-Z0-9]/g, "");

      extractedWords.push(extractedWord);

      return replacement;
    })
  );

  return {
    extractedWords,
    replaced: document.text(),
  };
}
