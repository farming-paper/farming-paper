import { Label, ListGroup } from "flowbite-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { shuffle } from "~/util";
import type { PickQuestion, QuestionInputProps } from "../types";

const PickQuestionInput: React.FC<QuestionInputProps<PickQuestion>> = ({
  question,
  onFail,
  onSuccess,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const choices = useMemo(() => {
    let choices = [...question.wrongs];
    choices.push(question.correct);
    choices = shuffle(choices);
    return choices;
  }, [question.correct, question.wrongs]);

  const onSubmit = useCallback(
    (submitted: string) => {
      if (submitted === question.correct) {
        onSuccess?.({ given: submitted });
      } else {
        onFail?.({ given: submitted });
      }
    },
    [onFail, onSuccess, question.correct]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {question.tags && question.tags.length > 0 ? (
        <div className="mb-2 text-sm text-gray-500">
          {question.tags?.join(", ")}
        </div>
      ) : null}
      <div className="mb-2 ">
        <Label htmlFor="base" value="문제" />
      </div>
      <div className="mb-4">
        <div>{question.message}</div>
      </div>
      <ListGroup>
        {choices.map((choice) => (
          <ListGroup.Item onClick={() => onSubmit(choice)} key={choice}>
            {choice}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default PickQuestionInput;
