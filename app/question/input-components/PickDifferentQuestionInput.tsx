import { Label, ListGroup } from "flowbite-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { deepclone, shuffle } from "~/util";
import Render from "../Render";
import type { PickDifferentQuestion, QuestionInputProps } from "../types";

const PickDifferentQuestionInput: React.FC<
  QuestionInputProps<PickDifferentQuestion>
> = ({ question, onFail, onSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { choices, correct } = useMemo(() => {
    const pool = shuffle(deepclone(question.pool)).map((bag) => shuffle(bag));
    let choices = deepclone(pool[1])?.slice(0, 3);
    const correct = pool[0]?.[0];
    if (!correct || !choices) {
      // eslint-disable-next-line no-console
      console.error("pick_different error", pool);
      throw new Error("pick_different error");
    }

    choices.push(correct);
    choices = shuffle(choices);
    return { choices, correct };
  }, [question.pool]);

  const onSubmit = useCallback(
    (submitted: string) => {
      if (submitted === correct) {
        onSuccess?.({ given: submitted });
      } else {
        onFail?.({ given: submitted });
      }
    },
    [correct, onFail, onSuccess]
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
        <Label value="문제" />
      </div>
      <div className="mb-4">
        <div>
          &quot;<Render>{question.message}</Render>&quot; 중 다른 것을 하나
          고르세요.
        </div>
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

export default PickDifferentQuestionInput;
