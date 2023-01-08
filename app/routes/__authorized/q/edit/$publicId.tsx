import { Link, useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { PartialDeep } from "type-fest";
import { getSessionWithProfile } from "~/auth/get-session";
import DangerModal from "~/common/components/DangerModal";
import { createQuestion, removeUndefined } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import type { Question, QuestionRow } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import { createTag } from "~/tag/create";
import type { DatagaseTag, ITag } from "~/types";
import { getFormdataFromRequest, removeNullDeep } from "~/util";
import {
  createDeletionQuestionArgs,
  useDeletionQuestionFetcher,
} from "../delete";

export const meta: MetaFunction = () => {
  return {
    title: "문제 편집 | Farming Paper",
  };
};

export async function getQuestionRow({
  profileId,
  publicId,
}: {
  profileId: number;
  publicId: string;
}) {
  const db = getServerSideSupabaseClient();
  const questionRes = await db
    .from("questions")
    .select("*")
    .eq("creator", profileId)
    .is("deleted_at", null)
    .eq("public_id", publicId)
    .single();

  if (!questionRes.data) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const tags = await db
    .from("tags_questions_relation")
    .select("tag (*)")
    .eq("q", questionRes.data.id);

  if (!tags.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const row: QuestionRow = {
    content: createQuestion(questionRes.data?.content as PartialDeep<Question>),
    publicId: questionRes.data.public_id,
    updatedAt: questionRes.data.updated_at,
    tags: tags.data.map((t) => {
      const tag = t.tag as DatagaseTag;
      return removeNullDeep({
        id: tag.id,
        name: tag.name || "",
        publicId: tag.public_id,
        desc: tag.desc,
      });
    }),
  };

  return row;
}

export async function getAllTags({ profileId }: { profileId: number }) {
  const db = getServerSideSupabaseClient();
  const tagsRes = await db
    .from("tags")
    .select("name, public_id, desc, id")
    .eq("creator", profileId);

  if (!tagsRes.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const tags: ITag[] = tagsRes.data.map((t) => {
    return removeNullDeep({
      id: t.id,
      name: t.name || "",
      publicId: t.public_id,
      desc: t.desc,
    });
  });

  return tags;
}

export async function loader({ request, params }: LoaderArgs) {
  const publicId = params.publicId;
  if (!publicId) {
    throw new Response("Public Id Not Found", {
      status: 404,
    });
  }
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const [row, tags] = await Promise.all([
    getQuestionRow({ profileId: profile.id, publicId }),
    getAllTags({ profileId: profile.id }),
  ]);

  return json({
    row,
    tags,
  });
}

export default function QuestionEdit() {
  const editFetch = useFetcher<typeof action>();
  const loaded = useLoaderData<typeof loader>();

  const { handleSubmit, formState, control, watch, setValue, setFocus } =
    useForm({
      resolver: questionFormResolver,
      defaultValues: { question: loaded.row.content, tags: loaded.row.tags },
    });

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        const question = createQuestion(formData.question);
        const tags: ITag[] = removeUndefined(formData.tags).map(createTag);
        editFetch.submit(
          {
            formValues: JSON.stringify({ question, tags }),
          },
          {
            method: "post",
            action: `/q/edit/${loaded.row.publicId}`,
          }
        );
      }),
    [editFetch, handleSubmit, loaded.row.publicId]
  );

  const values = watch();

  useEffect(() => {
    if (editFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "성공적으로 수정되었습니다.",
        duration: 2,
      });
    } else if (editFetch?.data?.error) {
      message.error({
        key: "creating",
        content: "문제 수정이 실패했습니다.",
        duration: 2,
      });
      // eslint-disable-next-line no-console
      console.error("createNewFetch?.data?.error", editFetch?.data?.error);
    }
  }, [editFetch?.data]);

  useEffect(() => {
    if (editFetch.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 수정하는 중입니다...",
      });
    }
  }, [editFetch.state, setFocus, setValue]);

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const deleteFetcher = useDeletionQuestionFetcher();

  return (
    <div className="p-4">
      <header className="flex items-center justify-between">
        <h1 className="my-2 text-xl font-medium">문제 편집</h1>
        <div className="flex items-center">
          <Button size="small" danger onClick={() => setDeleteModalOpen(true)}>
            삭제
          </Button>
        </div>
      </header>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
        existingTags={loaded.tags}
      />
      <div className="flex justify-end">
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          수정
        </Button>
      </div>
      <DangerModal
        message="정말 문제를 삭제하시겠습니까? 한번 삭제하면 다시 복구할 수 없습니다."
        title="문제 삭제"
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onSubmit={() => {
          deleteFetcher.submit(
            createDeletionQuestionArgs({
              publicId: loaded.row.publicId,
            }),
            {
              method: "delete",
              action: `/q/delete`,
            }
          );
        }}
      />
    </div>
  );
}

export const action = async ({ request, params }: ActionArgs) => {
  const publicId = params.publicId;

  const editingData = await getFormdataFromRequest<{
    question: Question;
    tags: ITag[];
  }>({ request, keyName: "formValues" });

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

  const db = getServerSideSupabaseClient();

  const updatedQuestion = await db
    .from("questions")
    .update({
      content: editingData.question as unknown as Json,
    })
    .eq("creator", profile.id)
    .eq("public_id", publicId)
    .select("*")
    .single();

  if (!updatedQuestion.data) {
    return json({
      data: null,
      error: updatedQuestion.error?.message || "",
    });
  }

  // 현재 문제와 태그의 관계를 가져옵니다.
  const existingTagsRes = await db
    .from("tags_questions_relation")
    .select("tag (*)")
    .eq("q", updatedQuestion.data.id);

  if (!existingTagsRes.data) {
    return json({
      data: null,
      error: existingTagsRes.error?.message || "",
    });
  }

  const existingTags = existingTagsRes.data.map((t) => t.tag as DatagaseTag);

  // 원래 있는 태그 중 새로운 태그에 없는 태그들을 삭제합니다. (순수하게 삭제할 태그만 남깁니다.)
  const removingTagIds = existingTags
    .filter(
      (existingTag) =>
        !editingData.tags.some(
          (newTag) => newTag.publicId === existingTag.public_id
        )
    )
    .map((tag) => tag.id);

  // 새로운 태그 중 원래 있는 태그에 없는 태그들을 삭제합니다. (순수하게 추가할 태그만 남깁니다.)
  const addingTagIds = editingData.tags
    .filter(
      (newTag) => !existingTags.some((tag) => tag.public_id === newTag.publicId)
    )
    .map((tag) => tag.id);

  const [removeResult, addResult] = await Promise.all([
    db
      .from("tags_questions_relation")
      .delete()
      .in("tag", removingTagIds)
      .eq("q", updatedQuestion.data.id)
      .select("*"),

    db
      .from("tags_questions_relation")
      .insert(
        addingTagIds.map((addingTagId) => ({
          q: updatedQuestion.data.id,
          tag: addingTagId,
        }))
      )
      .select("*"),
  ] as const);

  if (!removeResult.data || !addResult.data) {
    return json({
      data: null,
      error: removeResult.error?.message || addResult.error?.message || "",
    });
  }

  return json({
    data: updatedQuestion.data,
    error: null,
  });
};

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div className="min-h-full px-6 py-16 bg-white @sm:py-24 @md:grid @md:place-items-center @lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="@sm:flex">
          <p className="text-4xl font-bold tracking-tight text-green-600 @sm:text-5xl">
            {caught.status}
          </p>
          <div className="@sm:ml-6">
            <div className="@sm:border-l @sm:border-gray-200 @sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 @sm:text-5xl">
                {caught.status === 404
                  ? "페이지를 찾을 수 없습니다."
                  : "오류가 발생했습니다."}
              </h1>
              {caught.status === 404 && (
                <p className="mt-1 text-base text-gray-500">
                  URL이 올바른지 확인하고 다시 시도해주세요.
                </p>
              )}
            </div>
            <div className="flex mt-10 space-x-3 @sm:border-l @sm:border-transparent @sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 "
              >
                홈으로 돌아가기
              </Link>
              <Link
                to="/account"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                문의하기
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
