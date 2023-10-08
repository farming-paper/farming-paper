import { PlusOutlined } from "@ant-design/icons";
import { Form } from "@remix-run/react";
import { Button, Input, Select, Space } from "antd";
import { Trash2 } from "lucide-react";
import type { Control, FormState, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import ErrorLabel from "~/common/components/ErrorLabel";
import Label from "~/common/components/Label";
import { createTag } from "~/tag/create";
import type { ITagWithCount } from "~/types";
import type { QuestionFormValues } from "../question-form-resolver";
import Tags from "./Tags";

const questionTypeOptions = [
  // {
  //   label: "단답형",
  //   value: "short",
  // },
  // {
  //   label: "단답형 (답 여러 개)",
  //   value: "short_multi",
  // },
  {
    label: "단답형 (답 여러 개 + 순서)",
    value: "short_order",
  },
  // {
  //   label: "다른 것 하나 고르기",
  //   value: "pick_different",
  // },
  // {
  //   label: "객관식",
  //   value: "pick",
  // },
  // {
  //   label: "객관식 (답 여러 개)",
  //   value: "pick_multi",
  // },
  // {
  //   label: "객관식 (답 여러 개 + 순서)",
  //   value: "pick_order",
  // },
];

const QuestionForm: React.FC<{
  control: Control<QuestionFormValues>;
  setValue: UseFormSetValue<QuestionFormValues>;
  formState: FormState<QuestionFormValues>;
  values: QuestionFormValues;
  existingTags: ITagWithCount[];
}> = ({ control, formState: { errors }, setValue, values, existingTags }) => {
  return (
    <Form>
      <div className="flex flex-col mb-4">
        <Label htmlFor="tags">태그</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => {
            const { onChange, value } = field;

            return (
              <Tags
                existingTags={existingTags}
                onChange={onChange}
                value={value?.map((v) => createTag(v))}
              />
            );
          }}
        />
      </div>

      <div className="flex flex-col mb-4">
        <Label htmlFor="question_type">문제 유형</Label>
        <Controller
          control={control}
          name="question.type"
          render={({ field }) => {
            return (
              <Select
                {...field}
                options={questionTypeOptions}
                id="question_type"
              />
            );
          }}
        />
      </div>

      <div className="flex flex-col mb-4">
        <Label htmlFor="question_message">내용</Label>
        <Controller
          control={control}
          name="question.message"
          render={({ field }) => {
            return (
              <Input.TextArea
                autoSize={{ minRows: 3 }}
                {...field}
                required
                id="question_message"
                placeholder="내용을 작성하세요"
              />
            );
          }}
        />
        {errors.question?.message && (
          <ErrorLabel htmlFor="question_message">
            <>{errors.question.message}</>
          </ErrorLabel>
        )}
      </div>

      {/* ShortOrder corrects */}
      {values.question?.type === "short_order" && (
        <div className="flex flex-col mb-4">
          <Label htmlFor="correct">정답</Label>
          <div className="flex flex-col gap-2 mb-5">
            {values.question.corrects?.map((q, index) => (
              <div key={index} className="flex gap-2">
                <Space.Compact className="flex">
                  <Controller
                    control={control}
                    name={`question.corrects.${index}`}
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          style={{ width: "calc(100% - 3rem)" }}
                          defaultValue="git@github.com:ant-design/ant-design.git"
                        />
                      );
                    }}
                  />
                  <Button
                    className="w-12 p-0 text-xl text-gray-400"
                    onClick={() => {
                      if (
                        values.question?.type === "short_order" &&
                        values.question.corrects
                      ) {
                        setValue(`question.corrects`, [
                          ...values.question.corrects.slice(0, index),
                          ...values.question.corrects.slice(index + 1),
                        ]);
                      }
                    }}
                  >
                    <Trash2 className="h-[1em] mx-auto" />
                  </Button>
                </Space.Compact>
              </div>
            ))}
          </div>
          <div className="flex">
            <Button
              size="small"
              type="dashed"
              onClick={() => {
                if (values.question?.type === "short_order") {
                  setValue(`question.corrects`, [
                    ...(values.question.corrects ?? []),
                    "",
                  ]);
                }
              }}
            >
              <PlusOutlined />
              <span>정답 추가</span>
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default QuestionForm;
