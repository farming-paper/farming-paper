import { Button } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useBlankSubmissionMap } from "./SolveQuestionAtom";
import { useQuestion } from "./context";

export default function SolveSubmitButton() {
  const question = useQuestion();
  const submission = useBlankSubmissionMap();

  return (
    <Form className="flex-inline" method="post">
      <input type="hidden" name="intent" value="solve" />
      <input type="hidden" name="question_id" value={question.id} />
      <input
        type="hidden"
        name="submission"
        value={JSON.stringify(submission)}
      />
      <Button color="primary" type="submit">
        SUBMIT
      </Button>
    </Form>
  );
}
