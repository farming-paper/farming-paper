import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { requireAuth } from "~/auth/get-session";
import { Button } from "~/common/components/mockups";
import useCmdEnter from "~/common/hooks/use-cmd-enter";
import { createQuestion, removeUndefined } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import { rpc } from "~/supabase/rpc";
import { createTag } from "~/tag/create";
import type { ITagWithCount } from "~/types";
import { removeNullDeep } from "~/util";
import {
  createCreateQuestionArgs,
  useCreateQuestionFetcher,
} from "./_auth.q.create";

export const meta: MetaFunction = () => {
  return [
    {
      title: "문제 생성 | Farming Paper",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const tagsRes = await rpc("get_tags_by_creator_with_count", {
    p_creator: profile.id,
  });

  if (tagsRes.error) {
    throw new Response("Something went wrong while fetching tags", {
      status: 500,
    });
  }

  const tags: ITagWithCount[] = tagsRes.data.map((t) =>
    removeNullDeep({
      publicId: t.public_id,
      desc: t.desc,
      name: t.name || "",
      count: t.count,
    })
  );

  return json({
    tags,
  });
}

export default function QuestionNew() {
  const { tags } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState,
    control,
    watch,
    setValue,
    setFocus: _setFocus,
  } = useForm({
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

  // useEffect(() => {
  //   if (createQuestionFetch.data && createQuestionFetch.state === "idle") {
  //     message.success({
  //       key: "creating",
  //       content: "문제가 성공적으로 생성되었습니다.",
  //     });
  //   }
  // }, [createQuestionFetch.data, createQuestionFetch.state, message]);

  // useEffect(() => {
  //   if (createQuestionFetch.state === "submitting") {
  //     message.loading({
  //       key: "creating",
  //       content: "문제를 생성하는 중입니다...",
  //     });
  //     setTimeout(() => {
  //       setValue("question.message", "");
  //       setValue("question.corrects", [""]);
  //       setFocus("question.message");
  //     });
  //   }
  // }, [createQuestionFetch.state, message, setFocus, setValue]);

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
