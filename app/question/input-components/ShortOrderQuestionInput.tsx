import { Button, Label, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isArrayEqual } from "~/util";
import Render from "../Render";
import type { QuestionInputProps, ShortOrderQuestion } from "../types";

const ShortOrderQuestionInput: React.FC<
  QuestionInputProps<ShortOrderQuestion>
> = ({ question, onFail, onSuccess }) => {
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(() => {
    const answerArray = value.split(",").map((s) => s.trim());

    if (isArrayEqual(answerArray, question.correct)) {
      onSuccess?.({ given: answerArray.join(", ") });
    } else {
      onFail?.({ given: answerArray.join(", ") });
    }

    setValue("");
  }, [onFail, onSuccess, question.correct, value]);

  useEffect(() => {
    if (value === "") {
      inputRef.current?.focus();
    }
  }, [value]);

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
        <Render>{question.message}</Render>
      </div>
      <div className="mb-2 ">
        <Label htmlFor="base" value="정답" />
      </div>
      <div className="flex items-center gap-3">
        <TextInput
          ref={inputRef}
          type="text"
          className="flex-1"
          sizing="lg"
          placeholder="정답을 입력하세요"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              onSubmit();
            }
          }}
        />
        <Button onClick={onSubmit}>확인</Button>
      </div>
    </div>
  );
};

export default ShortOrderQuestionInput;
