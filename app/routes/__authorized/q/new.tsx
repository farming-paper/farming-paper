import { useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getSessionWithProfile } from "~/auth/get-session";
import { createQuestion, removeUndefined } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import type { Question } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import { createTag } from "~/tag/create";
import type { ITag } from "~/types";
import { removeNullDeep, typedFetcher } from "~/util";

export const meta: MetaFunction = () => {
  return {
    title: "새로운 문제 만들기 | Farming Paper",
  };
};

const {
  createArgs: createBody,
  getArgsFromRequest,
  useFetcher: useNewQuestionFetcher,
} = typedFetcher<
  typeof action,
  {
    question: Question;
    tags: ITag[];
  }
>();

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
  const createNewFetch = useNewQuestionFetcher();

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        createNewFetch.submit(
          createBody({
            question: createQuestion(formData.question),
            tags: removeUndefined(formData.tags).map(createTag),
          }),
          {
            method: "post",
            action: `/q/new`,
          }
        );
      }),
    [createNewFetch, handleSubmit]
  );

  const values = watch();

  useEffect(() => {
    if (createNewFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "문제가 성공적으로 생성되었습니다.",
      });
    } else if (createNewFetch?.data?.error) {
      message.error({ key: "creating", content: "문제 생성이 실패했습니다." });
      // eslint-disable-next-line no-console
      console.error("createNewFetch?.data?.error", createNewFetch?.data?.error);
    }
  }, [createNewFetch?.data?.data, createNewFetch?.data?.error]);

  useEffect(() => {
    if (createNewFetch.state === "submitting") {
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
      <h1 className="my-2 text-xl font-medium">새로운 문제 만들기</h1>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
        existingTags={tags}
      />
      <div className="flex justify-end">
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          만들기
        </Button>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const { question, tags } = await getArgsFromRequest(request);

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

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
  }

  const tagRelationRes = await db
    .from("tags_questions_relation")
    .upsert(
      tags.map((t) => ({
        q: inserted.data.id,
        tag: t.id,
      }))
    )
    .select("*");

  if (tagRelationRes.error) {
    return json({
      data: null,
      error: tagRelationRes.error.message,
    });
  }

  return json({
    data: inserted.data,
    error: null,
  });
};
