import { Button, Link, Pagination } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import DefaultLayout from "~/common/components/DefaultLayout";
import { DeleteQuestionModalWithButton } from "~/common/components/DeleteQuestionModalWithButton";
import { SetTagModal } from "~/common/components/SetTagModal";
import SideMenuV2 from "~/common/components/SideMenuV2";
import { defaultMeta } from "~/meta";
import { QuestionProvider } from "~/question/context";
import ParagrahEditor from "~/question/edit-components/ParagraphEditor";
import type { Question } from "~/question/types";
import TagFilterChip from "~/tag/component/tag-filter-chip";
import useAddTagFilter from "~/tag/use-add-tag-filter";
import useDeleteTagFilter from "~/tag/use-delete-tag-filter";
import { useHeaderHeight } from "./headerHeight";
import type { loader } from "./loader";
import { searchParamsSchema } from "./searchParamsSchema";
export { action } from "./action";
export { loader } from "./loader";

export const meta: MetaFunction = () => {
  return [...defaultMeta, { title: "대시보드 | Farming Paper" }];
};

const emptyTags: string[] = [];

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();
  const validatedParams = useMemo(() => {
    const obj = Object.fromEntries(params);
    const validation = searchParamsSchema.safeParse(obj);
    if (!validation.success) {
      return null;
    }

    return validation.data;
  }, [params]);

  const page = validatedParams?.page || 1;
  const tags = validatedParams?.tags || emptyTags;

  const { count, recentTags, allTags } = data;

  const tagFilters = useMemo(() => {
    const tagsSet = new Set(tags);
    return recentTags.map((tag) => ({
      publicId: tag.public_id,
      name: tag.name || "",
      active: tagsSet.has(tag.public_id),
    }));
  }, [tags, recentTags]);

  const addTagFilter = useAddTagFilter();
  const deleteTagFilter = useDeleteTagFilter();
  const questions: Question[] = useMemo(
    () =>
      data.questions.map(
        (q): Question => ({
          id: q.id,
          originalId: q.original_id,
          content: q.content,
          createdAt: dayjs(q.created_at),
          updatedAt: dayjs(q.updated_at),
          deletedAt: q.deleted_at ? dayjs(q.deleted_at) : null,
          publicId: q.public_id,
          tags: q.tags_questions_relation.map((t) => {
            return {
              name: t.tags.name || "",
              publicId: t.tags.public_id,
            };
          }),
        })
      ),
    [data.questions]
  );

  const startIndex = count - (page - 1) * 10;
  const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useHeaderHeight();

  useEffect(() => {
    if (!headerRef) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (headerRef) {
        setHeaderHeight(headerRef.clientHeight);
      }
    });

    resizeObserver.observe(headerRef);
    return () => {
      resizeObserver.disconnect();
    };
  }, [headerRef, setHeaderHeight]);

  return (
    <DefaultLayout sidebarTop={<SideMenuV2 />} className="relative">
      <div
        className="absolute left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none mt-14"
        ref={setHeaderRef}
      >
        {/* tags */}
        <div className="flex px-[max(calc((100%-700px)/2),0.5rem)] min-w-[700px] w-full">
          <div className="inline-flex flex-wrap gap-2.5 mb-4">
            {tagFilters.map((tag) => {
              if (tag.name) {
                return (
                  <TagFilterChip
                    className="pointer-events-auto"
                    key={tag.publicId}
                    name={tag.name}
                    active={tag.active}
                    onClick={() => {
                      if (tag.active) {
                        deleteTagFilter(tag.publicId);
                      } else {
                        addTagFilter(tag.publicId);
                      }
                    }}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="flex gap-4 px-[max(calc((100%-700px)/2),0.5rem)] min-w-[700px] w-full">
          {/* header toolbar */}
          <Form method="post">
            <input type="hidden" name="intent" value="create_question" />
            <Button
              isIconOnly
              variant="shadow"
              className="pointer-events-auto min-w-11"
              color="primary"
              type="submit"
            >
              <span className="sr-only">단락 추가</span>
              <Plus className="w-4.5 h-4.5 " aria-hidden />
            </Button>
          </Form>
          {tags.length > 0 && (
            <Button
              as={Link}
              className="text-white pointer-events-auto bg-primary min-w-11"
              href={`/solve?tags=${params.get("tags")}`}
              color="primary"
              variant="shadow"
            >
              <span>
                Solve <span className="font-bold">{count}</span> Question
                {count > 1 ? "s" : ""}
              </span>
            </Button>
          )}
          {tags.length === 0 && (
            <Button isDisabled>Click above tags for Solve</Button>
          )}
        </div>
      </div>

      {/* questions */}
      {questions.map((question, index) => {
        return (
          // question group
          <QuestionProvider
            key={question.originalId || question.id}
            question={question}
          >
            <ParagrahEditor
              key={question.originalId || question.id}
              autoSave
              toolbar={
                <div className="flex transition opacity-0 group-hover:opacity-100 group-has-[*:focus]:opacity-100 group-has-[[aria-expanded=true]]:opacity-100">
                  <div
                    className="flex items-center py-1 text-xs text-gray-400 gap-2.5 select-none"
                    style={{
                      backgroundColor: "rgba(249, 250, 251, 0.3)",
                    }}
                  >
                    <span className="font-mono">[{startIndex - index}]</span>
                    <span className="font-mono">
                      {question.createdAt.format("YYYY.MM.DD.")}
                    </span>
                    {question.tags.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5 text-gray-300" />
                        <span>
                          {question.tags.map((t) => t.name).join(", ")}
                        </span>
                      </div>
                    )}
                    <SetTagModal
                      tags={allTags}
                      TriggerButton={({ onPress }) => (
                        <Button
                          onPress={onPress}
                          variant="light"
                          className="h-auto min-w-0 pl-0.5 py-0.5 pr-1  text-xs font-bold rounded-sm text-inherit gap-0.5"
                          startContent={
                            <Plus className="w-3 h-3 text-gray-300 " />
                          }
                          disableRipple
                        >
                          태그 추가
                        </Button>
                      )}
                    />
                    <DeleteQuestionModalWithButton
                      TriggerButton={({ onPress }) => (
                        <Button
                          onPress={onPress}
                          variant="light"
                          className="h-auto min-w-0 px-1 py-1 rounded-sm text-inherit"
                        >
                          <Trash2 className="w-3.5 h-3.5 " />
                        </Button>
                      )}
                    />
                  </div>
                </div>
              }
              className={twMerge("flex-1 text-gray-800 group")}
              style={
                {
                  ...(index === 0
                    ? { "--pe-top-padding": `calc(${headerHeight}px + 120px)` }
                    : index === questions.length - 1
                    ? { "--pe-bottom-padding": "120px" }
                    : {}),
                } as React.CSSProperties
              }
            />
          </QuestionProvider>
        );
      })}

      {/* pagination */}
      <Pagination
        className="absolute bottom-0 z-10 flex justify-center pb-10 mx-auto my-0 -translate-x-1/2 left-1/2"
        total={Math.ceil(count / 10)}
        page={page}
        onChange={(page) => {
          setParams({ page: page.toString() });
        }}
      />
    </DefaultLayout>
  );
}
