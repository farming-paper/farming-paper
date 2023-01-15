import { useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getSessionWithProfile } from "~/auth/get-session";
import useCmdEnter from "~/common/hooks/use-cmd-enter";
import { createQuestion, removeUndefined } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { createTag } from "~/tag/create";
import type { ITag } from "~/types";
import { removeNullDeep } from "~/util";
import { createCreateQuestionArgs, useCreateQuestionFetcher } from "./create";

export const meta: MetaFunction = () => {
  return {
    title: "문제 생성 | Farming Paper",
  };
};

export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const db = getServerSideSupabaseClient();

  const tagsRes = await db.from("tags").select("*").eq("creator", profile.id);
  if (tagsRes.error) {
    throw new Response("Something went wrong while fetching tags", {
      status: 500,
    });
  }

  const tags: ITag[] = tagsRes.data.map((t) =>
    removeNullDeep({
      id: t.id,
      publicId: t.public_id,
      desc: t.desc,
      name: t.name || "",
    })
  );

  return json({
    tags,
  });
}

export default function QuestionNew() {
  const { tags } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const { handleSubmit, formState, control, watch, setValue, setFocus } =
    useForm({
      resolver: questionFormResolver,
      defaultValues: {
        question: {
          type: "short_order",
          message: "",
          corrects: [""],
        },
        tags: [],
      },
    });

  const createQuestionFetch = useCreateQuestionFetcher();

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        createQuestionFetch.submit(
          createCreateQuestionArgs({
            question: createQuestion(formData.question),
            tags: removeUndefined(formData.tags).map(createTag),
          }),
          {
            method: "post",
            action: `/q/create`,
          }
        );
      }),
    [createQuestionFetch, handleSubmit]
  );

  const values = watch();

  useEffect(() => {
    if (createQuestionFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "문제가 성공적으로 생성되었습니다.",
      });
    } else if (createQuestionFetch?.data?.error) {
      message.error({ key: "creating", content: "문제 생성이 실패했습니다." });
      // eslint-disable-next-line no-console
      console.error(
        "createNewFetch?.data?.error",
        createQuestionFetch?.data?.error
      );
    }
  }, [createQuestionFetch?.data?.data, createQuestionFetch?.data?.error]);

  useEffect(() => {
    if (createQuestionFetch.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 생성하는 중입니다...",
      });
      setTimeout(() => {
        setValue("question.message", "");
        setValue("question.corrects", [""]);
        setFocus("question.message");
      });
    }
  }, [createQuestionFetch.state, setFocus, setValue]);

  useCmdEnter(onSubmit);

  return (
    <div className="p-4">
      <header className="flex items-center justify-between gap-4 my-2">
        <h1 className="m-0 text-xl font-medium">문제 생성</h1>
        <Button
          type="text"
          size="small"
          onClick={() => {
            navigate("/q/generator");
          }}
          className="flex items-center gap-1"
        >
          <span>문제 생성기</span>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </Button>
      </header>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
        existingTags={tags}
      />
      <div className="flex justify-end">
        <Button
          loading={createQuestionFetch.state === "submitting"}
          htmlType="submit"
          onClick={onSubmit}
          type="primary"
        >
          만들기
        </Button>
      </div>
    </div>
  );
}
