// adsp
import { createProblemGenerator } from "./problem-generator";
import { problems } from "./problems/adsp";

while (true) {
  const generator = createProblemGenerator(problems);
  const problem = generator.gen();
}
