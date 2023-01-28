import { Button, Input } from "antd";
import { useCallback, useState } from "react";
import { isArrayEqual } from "~/util";
import Render from "../Render";
import type { IShortOrderQuestion, QuestionInputProps } from "../types";

const ShortOrderQuestionInput: React.FC<
  QuestionInputProps<IShortOrderQuestion>
> = ({ question, onFail, onSuccess, disabled, antdInputRef }) => {
  const [value, setValue] = useState("");

  const onSubmit = useCallback(() => {
    const answerArray = value.split(",").map((s) => s.trim());

    if (isArrayEqual(answerArray, question.corrects)) {
      onSuccess?.({ given: answerArray.join(", ") });
    } else {
      onFail?.({ given: answerArray.join(", ") });
    }

    setValue("");
  }, [onFail, onSuccess, question.corrects, value]);

  return (
    <div>
      {/* {question.tags && question.tags.length > 0 ? (
        <div className="mb-2 text-sm text-gray-500">
          {question.tags?.join(", ")}
        </div>
      ) : null} */}
      <div className="mb-2 ">문제 </div>
      <div className="mb-4">
        <Render>{question.message}</Render>
      </div>
      <div className="mb-2 ">
        <label htmlFor="answer">정답</label>
      </div>
      <div className="flex items-center gap-3">
        <Input
          id="answer"
          enterKeyHint="go"
          ref={antdInputRef}
          disabled={disabled}
          type="text"
          className="flex-1"
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
