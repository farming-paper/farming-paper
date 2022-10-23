// adsp
import { createProblemGenerator } from "./problem-generator";
import { problems } from "./problems/adsp";
import prompts from "prompts";

while (true) {
  const generator = createProblemGenerator(problems);
  const problem = generator.gen();

  if (problem.type === "SHORT") {
    const response = await prompts({
      type: "text",
      name: "answer",
      message: problem.q + "\n",
      float: true,
    });

    if (typeof response.answer === "undefined") {
      process.exit();
    }

    if (response.answer === problem.correctA) {
      console.log("정답!");
    } else {
      console.log(`오답! (정답: ${problem.correctA})`);
    }
    console.log("\n");
  }

  await (async () => {})();
}
