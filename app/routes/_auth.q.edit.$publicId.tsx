// BEST PRACTICE
import { Select, SelectItem } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import editSingleQuestion from "~/actions/editSingleQuestion";
import { requireAuth } from "~/auth/get-session";
import DangerModal from "~/common/components/DangerModal";
import Label from "~/common/components/Label";
import { Button, Input, Space } from "~/common/components/mockups";
import { createQuestionContent } from "~/question/create";
import Tags from "~/question/edit-components/Tags";
import type { Question, QuestionContent } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import { rpc } from "~/supabase/rpc";
import type { ITagWithCount } from "~/types";
import { dayjs, removeNullDeep } from "~/util";

export const meta: MetaFunction = () => {
  return [
    {
      title: "문제 편집 | Farming Paper",
    },
  ];
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

  const row: Question = {
    id: questionRes.data.id,
    originalId: questionRes.data.id, // TODO: 이 파일 삭제
    content: createQuestionContent(
      questionRes.data?.content as Partial<QuestionContent>
    ),
    publicId: questionRes.data.public_id,
    updatedAt: dayjs(questionRes.data.updated_at),
    createdAt: dayjs(questionRes.data.created_at),
    deletedAt: questionRes.data.deleted_at
      ? dayjs(questionRes.data.deleted_at)
      : null,
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const publicId = params.publicId;
  const { profile } = await requireAuth(request);

  if (!publicId) {
    throw new Response("Public Id Not Found", {
      status: 404,
    });
  }

  const [row, tags] = await Promise.all([
    getQuestionRow({ profileId: profile.id, publicId }),
    getAllTags({ profileId: profile.id }),
  ]);

  return json({
    row,
    tags,
  });
}

export const action = editSingleQuestion;

export default function Page() {
  const loaded = useLoaderData<typeof loader>();
  const [editingContent, setEditingContent] = useState(loaded.row.content);
  const [tags, setTags] = useState(loaded.row.tags);

  const navigation = useNavigation();
  const submit = useSubmit();
  const _actionData = useActionData<typeof action>();

  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   if (navigation.state === "submitting") {
  //     message.loading({
  //       key: "edit-question",
  //       content: "문제를 수정하는 중입니다...",
  //       duration: 20,
  //     });
  //     return;
  //   }

  //   if (navigation.state === "idle" && actionData?.data) {
  //     message.success({
  //       key: "edit-question",
  //       content: "성공적으로 수정되었습니다.",
  //       duration: 2,
  //     });
  //     return;
  //   }
  //   if (navigation.state === "idle" && actionData?.error) {
  //     message.error({
  //       key: "edit-question",
  //       content: "문제 수정에 실패했습니다.",
  //       duration: 2,
  //     });
  //     // eslint-disable-next-line no-console
  //     console.error("actionData.error", actionData.error);
  //     return;
  //   }
  // }, [actionData, navigation.state, message]);

  /** keyboard shortcut */
  useEffect(() => {
    const submitShortcut = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && formRef.current) {
        submit(formRef.current);
      }
    };
    document.addEventListener("keydown", submitShortcut);
    return () => {
      document.removeEventListener("keydown", submitShortcut);
    };
  }, [navigation, submit]);

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
      <Form method="post" ref={formRef}>
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
          {/* TODO: implement */}
          <Select
            label="문제 유형을 선택하세요"
            className="max-w-xs"
            selectionMode="single"
            selectedKeys={[loaded.row.content.type]}
          >
            {questionTypeOptions.map((questionType) => (
              <SelectItem key={questionType.value} value={questionType.value}>
                {questionType.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col mb-4">
          <Label htmlFor="question_message">내용</Label>
          <Input.TextArea
            autoSize={{ minRows: 3 }}
            required
            value={editingContent.message}
            onChange={(e: any) =>
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
                  <Space.Compact className="w-full">
                    <Input
                      style={{ width: "calc(100% - 3rem)" }}
                      value={q}
                      onChange={(e: any) => {
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
                  </Space.Compact>
                </div>
              ))}
            </div>
            <div className="flex">
              <Button
                size="small"
                type="dashed"
                className="inline-flex items-center gap-1"
                onClick={() => {
                  setEditingContent({
                    ...editingContent,
                    corrects: [...editingContent.corrects, ""],
                  });
                }}
              >
                <Plus className="w-4 h-4" /> 정답 추가
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            htmlType="submit"
            type="primary"
            loading={navigation.state !== "idle"}
          >
            수정
          </Button>
        </div>
      </Form>
      <Form>
        <input type="hidden" name="public_id" value={loaded.row.publicId} />
        <input type="hidden" name="intent" value="delete_question" />
        <DangerModal
          message="정말 문제를 삭제하시겠습니까? 한번 삭제하면 다시 복구할 수 없습니다."
          title="문제 삭제"
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          form={{
            hiddenValues: {
              public_id: loaded.row.publicId,
              intent: "delete_question",
            },
          }}
        />
      </Form>
    </div>
  );
}
