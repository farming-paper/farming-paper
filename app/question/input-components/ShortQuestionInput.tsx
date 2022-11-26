import { Button, Label, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { QuestionInputProps, ShortQuestion } from "../types";

const ShortQuestionInput: React.FC<QuestionInputProps<ShortQuestion>> = ({
  question,
  onFail,
  onSuccess,
}) => {
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(() => {
    if (question.correct === value) {
      onSuccess?.({ given: value });
    } else {
      onFail?.({ given: value });
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
        <Label htmlFor="base" value="문제" />
      </div>
      <div className="mb-4">
        <div>{question.message}</div>
      </div>
      <div className="mb-2 ">
        <Label htmlFor="base" value="정답" />
      </div>
      <div className="flex gap-3">
        <TextInput
          ref={inputRef}
          id="base"
          type="text"
          className="flex-1"
          sizing="md"
          placeholder="정답을 입력하세요"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={(e) => {
            console.log(e);
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

export default ShortQuestionInput;
