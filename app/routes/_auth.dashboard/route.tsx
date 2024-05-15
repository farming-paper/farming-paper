import { BreadcrumbItem, Button, Link, Pagination } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import { isKeyHotkey } from "is-hotkey";
import { Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import DefaultBreadcrumbs from "~/common/components/DefaultBreadcrumbs";
import DefaultLayout from "~/common/components/DefaultLayout";
import { DeleteQuestionModalWithButton } from "~/common/components/DeleteQuestionModalWithButton";
import { SetTagModal } from "~/common/components/SetTagModal";
import SideMenuV2 from "~/common/components/SideMenuV2";
import { defaultMeta } from "~/meta";
import { QuestionProvider } from "~/question/context";
import ParagraphEditor from "~/question/edit-components/ParagraphEditor";
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

  const addQuestionFetcher = useFetcher();

  const addQuestionFetcherData = useMemo(() => {
    if (addQuestionFetcher.state === "idle" && addQuestionFetcher.data) {
      return addQuestionFetcher.data as { data: string };
    }
    return null;
  }, [addQuestionFetcher]);

  const addQuestionFetcherSubmitButtonRef = useRef<HTMLButtonElement | null>(
    null
  );

  // mod+enter to create new question
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isKeyHotkey("mod+enter", event)) {
        event.preventDefault();
        addQuestionFetcherSubmitButtonRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <DefaultLayout
      header={
        <DefaultBreadcrumbs>
          <BreadcrumbItem href="/dashboard" className="text-default-500">
            Home
          </BreadcrumbItem>
        </DefaultBreadcrumbs>
      }
      sidebarTop={<SideMenuV2 />}
      className="relative"
    >
      <div
        className="absolute left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none mt-14"
        ref={setHeaderRef}
      >
        {/* tags */}
        <div className="flex px-[max(calc((100%-700px)/2),0.75rem)] w-full">
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

        <div className="flex gap-4 px-[max(calc((100%-700px)/2),0.75rem)] w-full">
          {/* header toolbar */}
          <addQuestionFetcher.Form method="post">
            <input type="hidden" name="intent" value="create_question" />
            <Button
              isIconOnly
              isLoading={addQuestionFetcher.state !== "idle"}
              spinner={<Loader2 className="w-5 h-5 animate-spin" />}
              variant="shadow"
              className="pointer-events-auto min-w-11"
              color="primary"
              type="submit"
              ref={addQuestionFetcherSubmitButtonRef}
            >
              <span className="sr-only">단락 추가</span>
              <Plus className="w-4.5 h-4.5 " aria-hidden />
            </Button>
          </addQuestionFetcher.Form>
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
            <ParagraphEditor
              key={question.originalId || question.id}
              created={addQuestionFetcherData?.data === question.publicId}
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
          setParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.set("page", page.toString());
            return newParams;
          });
        }}
      />
    </DefaultLayout>
  );
}
