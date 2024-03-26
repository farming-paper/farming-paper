import { useCallback, useEffect, useMemo, useRef } from "react";
import { List } from "~/common/components/mockups";
import { shuffle } from "~/util";
import Render from "../Render";
import type { IPickQuestion, QuestionInputProps } from "../types";

const PickQuestionInput: React.FC<QuestionInputProps<IPickQuestion>> = ({
  question,
  onFail,
  onSuccess,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const choices = useMemo(() => {
    let choices = [...question.options];
    choices.push(question.correct);
    choices = shuffle(choices);
    return choices;
  }, [question.correct, question.options]);

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
      {/* {question.tags && question.tags.length > 0 ? (
        <div className="mb-2 text-sm text-gray-500">
          {question.tags?.join(", ")}
        </div>
      ) : null} */}
      <div className="mb-2 ">문제</div>
      <div className="mb-4">
        <Render>{question.message}</Render>
      </div>
      <List
        bordered
        dataSource={choices}
        renderItem={(choice: any) => (
          <List.Item onClick={() => onSubmit(choice)}>{choice}</List.Item>
        )}
      />
    </div>
  );
};

export default PickQuestionInput;
