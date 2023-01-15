import nlp from "compromise";

describe("compromise", () => {
  test("find 테스트", () => {
    const n = nlp("That's what I did!");

    const res = n.verbs();

    const terms = n.terms();

    const nouns = n.terms();

    const res2 = res.toInfinitive();

    console.log(res);
    console.log(res2);

    res2.forEach((view) => n.replace(view, "___"));

    console.log(n.text());
  });
});
