import { Form, useActionData, useFetcher } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { Button, Input } from "antd";
import { useEffect } from "react";
import type { FieldErrors, Resolver } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { PartialDeep } from "type-fest";
import Label from "~/components/Label";
import type { Question } from "~/question/types";

type FormValues = {
  question: PartialDeep<Question>;
};

function validateMessage(message: string | string[] | undefined) {
  if (typeof message === "string" && message.length > 0) {
    return true;
  }
  if (
    Array.isArray(message) &&
    message.filter((message) => Boolean(message)).length > 0
  ) {
    return true;
  }

  return "필수 입력입니다.";
}

export default function QuestionNew() {
  const resolver: Resolver<FormValues> = async (values) => {
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

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      question: {
        type: "short_order",
        message: "",
      },
    },
  });

  const data = useActionData<FormValues>(); //we access the return value of the action here

  const fetcher = useFetcher();

  const watched = watch();

  // useEffect(() => {
  //   if (fetcher.type === "init") {
  //     fetcher.load("/some/route");
  //   }
  // }, [fetcher]);

  // fetcher.data; // the data from the loader

  useEffect(() => {
    console.log("data", data);
  }, [data]);
  useEffect(() => {
    console.log("watched", watched);
  }, [watched]);

  // const errors = useMemo(() => {
  //   return {
  //     message: validateMessage(data?.question?.message),
  //   };
  // }, [data?.question.message]);

  return (
    <div>
      <h1 className="my-2">새로운 문제 만들기</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          fetcher.submit(
            {
              formValues: JSON.stringify(watched),
            },
            {
              method: "post",
              action: `/q/new`,
            }
          );
        }}
      >
        <div className="flex flex-col mb-4">
          <Label htmlFor="question_message">내용</Label>
          <Controller
            control={control}
            name="question.message"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  type="text"
                  // name="question.message"
                  id="question_message"
                  placeholder="이름을 작성하세요"
                  className="w-full max-w-xs input input-bordered input-secondary"
                />
              );
            }}
          />
          {/* {errors?.question?.message &&
            typeof errors.question.message !== "string" && (
              <ErrorLabel htmlFor="question_message">
                {errors.question.message.message}
              </ErrorLabel>
            )} */}
        </div>
        <Button htmlType="submit" type="primary">
          만들기
        </Button>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const data = Object.fromEntries(await request.formData()) as {
    formValues: string;
  };

  console.log(data.formValues);
  const formValues = JSON.parse(data.formValues) as FormValues;
  console.log("formValues", formValues);
  // outputs { name: '', email: '', password: '', confirmPassword: '' }

  const formErrors = {
    message: validateMessage(data?.question?.message),
  };

  //if there are errors, we return the form errors
  if (Object.values(formErrors).some(Boolean)) return { formErrors };
};
