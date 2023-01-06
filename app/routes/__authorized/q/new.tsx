import { MinusOutlined } from "@ant-design/icons";
import { Form, useFetcher } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, Input, Select } from "antd";
import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import type { FieldErrors, Resolver } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { PartialDeep } from "type-fest";
import { getSessionWithProfile } from "~/auth/get-session";
import ErrorLabel from "~/common/components/ErrorLabel";
import Label from "~/common/components/Label";
import { createQuestion } from "~/question/create";
import Tags from "~/question/edit-components/Tags";
import type { Question } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";

type FormValues = {
  question: PartialDeep<Question>;
};

const questionTypeOptions = [
  {
    label: "단답형",
    value: "short",
  },
  {
    label: "단답형 (답 여러 개)",
    value: "short_multi",
  },
  {
    label: "단답형 (답 여러 개 + 순서)",
    value: "short_order",
  },
  {
    label: "다른 것 하나 고르기",
    value: "pick_different",
  },
  {
    label: "객관식",
    value: "pick",
  },
  {
    label: "객관식 (답 여러 개)",
    value: "pick_multi",
  },
  {
    label: "객관식 (답 여러 개 + 순서)",
    value: "pick_order",
  },
];

const formResolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  if (!values.question.message) {
    if (!errors.question) {
      errors.question = {};
    }

    errors.question.message = {
      type: "required",
      message: "필수 입력입니다.",
    };
  }

  const hasError = Object.keys(errors).length > 0;

  return {
    values: !hasError ? values : {},
    errors,
  };
};

export default function QuestionNew() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: formResolver,
    defaultValues: {
      question: {
        type: "short_order",
        message: "",
        corrects: [""],
      },
    },
  });

  const fetcher = useFetcher();

  const values = watch();

  useEffect(() => {
    console.log("fetcher.data", fetcher.data);
  }, [fetcher.data]);
  useEffect(() => {
    console.log("values.question", values.question);
  }, [values]);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        const q = createQuestion(formData.question);
        fetcher.submit(
          {
            formValues: JSON.stringify(q),
          },
          {
            method: "post",
            action: `/q/new`,
          }
        );
      }),
    [fetcher, handleSubmit]
  );

  return (
    <div className="p-2">
      <h1 className="my-2 text-xl font-medium">새로운 문제 만들기</h1>
      <Form onSubmit={onSubmit}>
        <div className="flex flex-col mb-4">
          <Label htmlFor="question_message">타입</Label>
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
                  {...field}
                  required
                  id="question_message"
                  placeholder="내용을 작성하세요"
                />
              );
            }}
          />
          {errors?.question?.message &&
            typeof errors.question.message !== "string" && (
              <ErrorLabel htmlFor="question_message">
                {errors.question.message.message}
              </ErrorLabel>
            )}
        </div>

        {/* ShortOrder corrects */}
        {values.question?.type === "short_order" && (
          <div className="flex flex-col mb-4">
            <Label htmlFor="correct">정답</Label>
            <div className="flex flex-col gap-2 mb-2">
              {values.question.corrects?.map((q, index) => (
                <div key={index} className="flex gap-2">
                  <Controller
                    control={control}
                    name={`question.corrects.${index}`}
                    render={({ field }) => {
                      return <Input {...field} />;
                    }}
                  />

                  <Button
                    className="inline-flex items-center justify-center p-2 bg-transparent "
                    type="text"
                    onClick={() => {
                      if (
                        values.question.type === "short_order" &&
                        values.question.corrects
                      ) {
                        setValue(`question.corrects`, [
                          ...values.question.corrects.slice(0, index),
                          ...values.question.corrects.slice(index + 1),
                        ]);
                      }
                    }}
                    icon={<MinusOutlined />}
                  ></Button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Button
                onClick={() => {
                  if (values.question.type === "short_order") {
                    setValue(`question.corrects`, [
                      ...(values.question.corrects ?? []),
                      "",
                    ]);
                  }
                }}
              >
                추가
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col mb-4">
          <Label htmlFor="tags">태그</Label>
          <Controller
            control={control}
            name="question.tags"
            render={({ field }) => {
              const { onChange, value } = field;
              return <Tags onChange={onChange} value={value} />;
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button htmlType="submit" type="primary">
            만들기
          </Button>
        </div>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const data = Object.fromEntries(await request.formData()) as {
    formValues: string;
  };

  console.log(data.formValues);
  const question = JSON.parse(data.formValues) as Question;
  console.log("formValues", question);

  const response = new Response();
  const { session, profile } = await getSessionWithProfile({
    request,
    response,
  });

  console.log("session", session, profile);

  const db = getServerSideSupabaseClient();

  const inserted = await db
    .from("questions")
    .insert({
      creator: profile.id,
      public_id: nanoid(),
      content: question as unknown as Json,
    })
    .select("*")
    .single();

  if (!inserted.data) {
    return json({
      data: null,
      error: "inserted.data is null",
    });
  } else {
    return json({
      data: inserted.data,
      error: null,
    });
  }
};
