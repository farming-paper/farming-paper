import { useFetcher, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { PartialDeep } from "type-fest";
import { getSessionWithProfile } from "~/auth/get-session";
import { createQuestion } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import type { Question, QuestionRow } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import { removeNullDeep } from "~/util";

export const meta: MetaFunction = () => {
  return {
    title: "문제 편집 | Farming Paper",
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const publicId = params.publicId;
  if (!publicId) {
    throw new Response("Public Id Not Found", {
      status: 400,
    });
  }
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const db = getServerSideSupabaseClient();
  const questionRes = await db
    .from("questions")
    .select("*")
    .eq("creator", profile.id)
    .eq("public_id", publicId)
    .single();

  if (!questionRes.data) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const row: QuestionRow = removeNullDeep({
    ...questionRes.data,
    content: createQuestion(questionRes.data.content as PartialDeep<Question>),
  });

  return json({
    data: row,
  });
}

export default function QuestionEdit() {
  const createNewFetch = useFetcher<typeof action>();
  const loaded = useLoaderData<typeof loader>();

  const { handleSubmit, formState, control, watch, setValue, setFocus } =
    useForm({
      resolver: questionFormResolver,
      defaultValues: { question: loaded.data.content },
    });

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        const q = createQuestion(formData.question);
        createNewFetch.submit(
          {
            formValues: JSON.stringify(q),
          },
          {
            method: "post",
            action: `/q/edit/${loaded.data.public_id}`,
          }
        );
      }),
    [createNewFetch, handleSubmit, loaded.data.public_id]
  );

  const values = watch();

  useEffect(() => {
    if (createNewFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "성공적으로 수정되었습니다.",
      });
    } else if (createNewFetch?.data?.error) {
      message.error({ key: "creating", content: "문제 수정이 실패했습니다." });
      // eslint-disable-next-line no-console
      console.error("createNewFetch?.data?.error", createNewFetch?.data?.error);
    }
  }, [createNewFetch?.data?.data, createNewFetch?.data?.error]);

  useEffect(() => {
    if (createNewFetch.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 수정하는 중입니다...",
      });
    }
  }, [createNewFetch.state, setFocus, setValue]);

  /** keyboard shortcut */
  useEffect(() => {
    const submitShortcut = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        onSubmit();
      }
    };
    document.addEventListener("keydown", submitShortcut);
    return () => {
      document.removeEventListener("keydown", submitShortcut);
    };
  }, [onSubmit]);

  return (
    <div className="p-2">
      <h1 className="my-2 text-xl font-medium">문제 편집</h1>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
      />
      <div className="flex justify-end">
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          수정
        </Button>
      </div>
    </div>
  );
}

export const action = async ({ request, params }: ActionArgs) => {
  const publicId = params.publicId;
  const data = Object.fromEntries(await request.formData()) as {
    formValues: string;
  };

  const question = JSON.parse(data.formValues) as Question;

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

  const db = getServerSideSupabaseClient();

  const updated = await db
    .from("questions")
    .update({
      content: question as unknown as Json,
    })
    .eq("creator", profile.id)
    .eq("public_id", publicId)
    .select("*")
    .single();

  if (!updated.data) {
    return json({
      data: null,
      error: updated.error?.message || "",
    });
  } else {
    return json({
      data: updated.data,
      error: null,
    });
  }
};
