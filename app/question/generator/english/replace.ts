import nlp from "compromise";

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
  const words = Object.values(conjuagted[0] ?? {});

  if (conjuagted.length > 0) {
    const isEndingWithE = word[word.length - 1] === "e";
    const ing = `${isEndingWithE ? word.slice(0, -1) : word}ing`;
    if (!isEndingWithE) {
      words.push(`${word}${word[word.length - 1]}ing`);
    }
    words.push(ing);
  }

  const plural = nlp(word).nouns().toPlural().text();
  if (plural) {
    words.push(plural);
  }

  const document = nlp(sourceEngSentence);

  words.forEach((word) => document.replace(word, replacement));

  return document.text();
}
