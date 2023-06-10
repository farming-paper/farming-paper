import { useFetcher, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { Trash2 } from "lucide-react";
import type { PartialDeep } from "type-fest";
import { z } from "zod";
import { getSessionWithProfile } from "~/auth/get-session";
import DangerModal from "~/common/components/DangerModal";
import Label from "~/common/components/Label";
import { createQuestion } from "~/question/create";
import Tags from "~/question/edit-components/Tags";
import type { Question, QuestionRow } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import { rpc } from "~/supabase/rpc";
import type { DatabaseTag, ITagWithCount } from "~/types";
import { removeNullDeep } from "~/util";

export const meta: MetaFunction = () => {
  return {
    title: "문제 편집 | Farming Paper",
  };
};

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
    .select("*, tags_questions_relation (tag (*))")
    .eq("creator", profileId)
    .is("deleted_at", null)
    .eq("public_id", publicId)
    .returns<
      /** need manual typing. @see https://github.com/supabase/postgrest-js/issues/408 */
      (Database["public"]["Tables"]["questions"]["Row"] & {
        tags_questions_relation: {
          tag: Database["public"]["Tables"]["tags"]["Row"];
        }[];
      })[]
    >()
    .single();

  if (!questionRes.data) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const row: QuestionRow = {
    content: createQuestion(questionRes.data?.content as PartialDeep<Question>),
    publicId: questionRes.data.public_id,
    updatedAt: questionRes.data.updated_at,
    tags: questionRes.data.tags_questions_relation.map((relation) => {
      const tag = relation.tag;
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
  const tagsRes = await rpc("get_tags_by_creator_with_count", {
    p_creator: profileId,
  });

  if (!tagsRes.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const tags: ITagWithCount[] = tagsRes.data.map((t) => {
    return removeNullDeep({
      name: t.name || "",
      publicId: t.public_id,
      desc: t.desc,
      count: t.count,
    });
  });

  return tags;
}

export const actionValidator = withZod(
  /** TODO: fix to switch later. @see https://github.com/colinhacks/zod/issues/2106 */
  z.discriminatedUnion("intent", [
    z.object({ intent: z.literal("upsert_tag"), name: z.string() }),
    z.object({
      intent: z.literal("edit_question"),
      public_id: z.string(),
      content: z.string(),
    }),
  ])
);

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

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const data = await actionValidator.validate(formData);

  if (data.error) {
    return json(
      {
        data: null,
        error: data.error,
      },
      { status: 400 }
    );
  }

  if (data.data.intent === "upsert_tag") {
    // ...
    return json(
      {
        data: null,
        error: "Not Implemented",
      },
      { status: 501 }
    );
  }

  const { content, public_id } = data.data;
  const tagPublicIds = formData
    .getAll("tag_public_id")
    .map((v) => v.toString());

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

  const db = getServerSideSupabaseClient();

  const updatedQuestion = await db
    .from("questions")
    .update({
      content: JSON.parse(content),
    })
    .eq("creator", profile.id)
    .eq("public_id", public_id)
    .select("*")
    .single();

  if (!updatedQuestion.data) {
    return json({
      data: null,
      error: updatedQuestion.error?.message || "",
    });
  }

  // 현재 문제와 태그의 관계를 가져옵니다.
  const [existingTagsRes, editingDataTagsRes] = await Promise.all([
    db
      .from("tags_questions_relation")
      .select("tag (*)")
      .eq("q", updatedQuestion.data.id),
    db
      .from("tags")
      .select("id, public_id")
      .is("deleted_at", null)
      .in("public_id", tagPublicIds),
  ]);

  if (!existingTagsRes.data) {
    return json({
      data: null,
      error: "existingTagsRes " + (existingTagsRes.error?.message || ""),
    });
  }

  if (!editingDataTagsRes.data) {
    return json({
      data: null,
      error: "editingDataTagsRes " + (editingDataTagsRes.error?.message || ""),
    });
  }

  const existingTags = existingTagsRes.data.map(
    // TODO: fix typing
    (t) => t.tag as unknown as DatabaseTag
  );
  const editingDataTags = editingDataTagsRes.data;

  // 원래 있는 태그 중 새로운 태그에 없는 태그들을 삭제합니다. (순수하게 삭제할 태그만 남깁니다.)
  const removingTagIds = existingTags
    .filter(
      (existingTag) =>
        !editingDataTags.some(
          (newTag) => newTag.public_id === existingTag.public_id
        )
    )
    .map((tag) => tag.id);

  // 새로운 태그 중 원래 있는 태그에 없는 태그들을 삭제합니다. (순수하게 추가할 태그만 남깁니다.)
  const addingTagIds = editingDataTags
    .filter(
      (newTag) =>
        !existingTags.some((tag) => tag.public_id === newTag.public_id)
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
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();
  const [editingContent, setEditingContent] = useState(loaded.row.content);
  const [tags, setTags] = useState(loaded.row.tags);
  const act = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!act.data) {
      return;
    }

    if (act.data.data) {
      message.success({
        key: "creating",
        content: "성공적으로 수정되었습니다.",
        duration: 2,
      });
      return;
    }

    // eslint-disable-next-line no-console
    console.error("actionData.error", act.data.error);
  }, [act.data]);

  useEffect(() => {
    if (act.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 수정하는 중입니다...",
        duration: 20,
      });
    }
  }, [act.state]);

  /** keyboard shortcut */
  useEffect(() => {
    const submitShortcut = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && formRef.current) {
        act.submit(formRef.current);
      }
    };
    document.addEventListener("keydown", submitShortcut);
    return () => {
      document.removeEventListener("keydown", submitShortcut);
    };
  }, [act]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // TODO: 삭제 기능 복원
  // const deleteFetcher = useDeletionQuestionFetcher();

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
      <act.Form method="post" ref={formRef}>
        <input type="hidden" name="public_id" value={loaded.row.publicId} />
        <input type="hidden" name="intent" value="edit_question" />
        <input
          type="hidden"
          name="content"
          value={JSON.stringify(editingContent)}
        />
        {tags.map((tag) => {
          return (
            <input
              key={tag.publicId}
              type="hidden"
              name="tag_public_id"
              value={tag.publicId}
            />
          );
        })}

        <div className="flex flex-col mb-4">
          <Label htmlFor="tags">태그</Label>
          <Tags
            existingTags={loaded.tags}
            onChange={(changed) => {
              setTags(changed);
            }}
            value={tags}
          />
        </div>

        <div className="flex flex-col mb-4">
          <Label htmlFor="question_type">문제 유형</Label>
          {/* TODO: implement */}
          <Select
            options={questionTypeOptions}
            id="question_type"
            value={loaded.row.content.type}
          />
        </div>

        <div className="flex flex-col mb-4">
          <Label htmlFor="question_message">내용</Label>
          <Input.TextArea
            autoSize={{ minRows: 3 }}
            required
            value={editingContent.message}
            onChange={(e) =>
              setEditingContent({ ...editingContent, message: e.target.value })
            }
            placeholder="내용을 작성하세요"
          />
        </div>

        {/* ShortOrder corrects */}
        {editingContent.type === "short_order" && (
          <div className="flex flex-col mb-4">
            <Label htmlFor="correct">정답</Label>
            <div className="flex flex-col gap-2 mb-5">
              {editingContent.corrects?.map((q, index) => (
                <div key={index} className="flex gap-2">
                  <Input.Group compact className="flex">
                    <Input
                      style={{ width: "calc(100% - 3rem)" }}
                      value={q}
                      onChange={(e) => {
                        setEditingContent({
                          ...editingContent,
                          corrects: editingContent.corrects.map((c, i) =>
                            i === index ? e.target.value : c
                          ),
                        });
                      }}
                    />
                    <Button
                      className="w-12 p-0 text-xl text-gray-400"
                      onClick={() => {
                        setEditingContent({
                          ...editingContent,
                          corrects: editingContent.corrects.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      <Trash2 className="h-[1em] mx-auto" />
                    </Button>
                  </Input.Group>
                </div>
              ))}
            </div>
            <div className="flex">
              <Button
                size="small"
                type="dashed"
                onClick={() => {
                  setEditingContent({
                    ...editingContent,
                    corrects: [...editingContent.corrects, ""],
                  });
                }}
              >
                <PlusOutlined />
                <span>정답 추가</span>
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            htmlType="submit"
            type="primary"
            loading={act.state !== "idle"}
          >
            수정
          </Button>
        </div>
      </act.Form>
      <DangerModal
        message="정말 문제를 삭제하시겠습니까? 한번 삭제하면 다시 복구할 수 없습니다."
        title="문제 삭제"
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        // TODO: 고우..
        // onSubmit={() => {
        //   deleteFetcher.submit(
        //     createDeletionQuestionArgs({
        //       publicId: loaded.row.publicId,
        //     }),
        //     {
        //       method: "delete",
        //       action: `/q/delete`,
        //     }
        //   );
        // }}
      />
    </div>
  );
}
