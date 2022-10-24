// adsp
import { createProblemGenerator } from "./problem-generator";
import { problems } from "./problems/adsp";
import prompts from "prompts";
import { isBagEqual } from "./util";

while (true) {
  const generator = createProblemGenerator(problems);
  const problem = generator.gen();

  switch (problem.type) {
    // case "SHORT": {
    //   const response = await prompts({
    //     type: "text",
    //     name: "answer",
    //     message: `${problem.q}\n`,
    //   });

    //   if (typeof response.answer === "undefined") {
    //     process.exit();
    //   }

    //   if (response.answer === problem.correctA) {
    //     console.log("정답!");
    //   } else {
    //     console.log(`오답! (정답: ${problem.correctA})`);
    //   }
    //   break;
    // }

    case "SHORT_MULTI": {
      const response = await prompts({
        type: "list",
        name: "answer",
        message: `${problem.q}\n`,
      });

      if (typeof response.answer === "undefined") {
        process.exit();
      }

      if (isBagEqual(response.answer, problem.correctA)) {
        console.log("정답!");
      } else {
        console.log(`오답! (정답: ${problem.correctA.join(", ")})`);
      }
    }
  }

  console.log("");
}
