import { Button, Input } from "antd";
import { useCallback, useState } from "react";
import Render from "../Render";
import type { IShortQuestion, QuestionInputProps } from "../types";

const ShortQuestionInput: React.FC<QuestionInputProps<IShortQuestion>> = ({
  question,
  onFail,
  onSuccess,
}) => {
  const [value, setValue] = useState("");

  const onSubmit = useCallback(() => {
    if (question.correct === value) {
      onSuccess?.({ given: value });
    } else {
      onFail?.({ given: value });
    }
    setValue("");
  }, [onFail, onSuccess, question.correct, value]);

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
      <div className="mb-2 ">
        <label htmlFor="answer">정답</label>
      </div>
      <div className="flex items-center gap-3">
        <Input
          id="answer"
          type="text"
          className="flex-1"
          placeholder="정답을 입력하세요"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={(e) => {
            // eslint-disable-next-line no-console
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
