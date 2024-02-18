import type { Prisma } from "@prisma/client";
import { Await, Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { defer } from "@remix-run/server-runtime";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronRightIcon, FilePlus, PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { requireAuth } from "~/auth/get-session";
import DateFilterButton from "~/common/components/DateFilterButton";
import MobileLayout from "~/common/components/MobileLayout";
import TagFilterButton from "~/common/components/TagFilterButton";
import { Pagination, Tooltip } from "~/common/components/mockups";
import prisma from "~/prisma-client.server";
import { createQuestion } from "~/question/create";
import type { QuestionContent } from "~/question/types";
import { getFilterTagsByCreatorId } from "~/supabase/getters";
import { getObjBigintToNumber } from "~/util";

const numberPerPage = 10;

export async function getMyTagNames({ request }: { request: Request }) {
  const { profile } = await requireAuth(request);
  return getFilterTagsByCreatorId(profile.id);
}

export async function getMyQuestions({
  page,
  request,
  dateFilter,
  tags,
}: {
  page: number;
  request: Request;
  search?: string;
  tags?: string[];
  dateFilter?: {
    start: string; // YYYY-MM-DDTHH:mm:ss
    end: string; // YYYY-MM-DDTHH:mm:ss
  };
}) {
  const { profile } = await requireAuth(request);

  const where: Prisma.questionsWhereInput = {
    creator: profile.id,
    deleted_at: null,
  };

  if (dateFilter) {
    where.created_at = {
      gte: dateFilter.start,
      lte: dateFilter.end,
    };
  }

  if (tags) {
    // TODO: tags_questions_relation 가져오는 서브쿼리 구성에 버그가 있음. 수정이 되었을 시 간단하게 수정할 것.
    const tagContainedQuestionIds =
      await prisma.tags_questions_relation.findMany({
        where: { tags: { public_id: { in: tags } } },
        select: { q: true },
      });

    where.id = {
      in: tagContainedQuestionIds.map((rel) => rel.q),
    };
  }

  const [questions, total] = await Promise.all([
    prisma.questions.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * numberPerPage,
      take: numberPerPage,
    }),
    prisma.questions.count({
      where,
    }),
  ]);

  return {
    items: questions.map((q) => {
      return {
        ...getObjBigintToNumber(q),
        content: createQuestion(q.content as Partial<QuestionContent>),
      };
    }),
    total,
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageStr = url.searchParams.get("p");

  const page = Number.parseInt(pageStr || "1");
  if (Number.isNaN(page)) {
    throw new Response("page is NaN", { status: 400 });
  }

  const search = url.searchParams.get("search") || undefined;

  const tags = url.searchParams.get("tags")?.split(",") || undefined;

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const dateFilter = start && end ? { start, end } : undefined;

  return defer({
    question: getMyQuestions({ page, request, search, tags, dateFilter }),
    page,
    tags: getMyTagNames({ request }),
  });
}

export default function QuestionList() {
  const loaded = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const [search] = useState("");

  // useEffect(() => {
  //   const url = new URL(document.location.href);
  //   const deleted = url.searchParams.get("deleted");
  //   message.destroy("question-deleted");
  //   message.destroy("edit-question");
  //   if (deleted === "1") {
  //     message.success({
  //       content: "문제가 삭제되었습니다.",
  //       key: "question-deleted",
  //     });
  //   }
  // }, [message]);

  return (
    <MobileLayout>
      <div className="flex flex-col p-4">
        <header className="flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {!search && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="m-0 text-xl font-medium">문제 리스트</h1>
                  </div>
                  <Link
                    to="/q/new"
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <PlusIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    추가
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="-mx-4 overflow-auto scroll">
            <div className="p-4">
              <div className="flex min-w-full gap-2 align-middle whitespace-nowrap">
                <DateFilterButton />
                <Suspense fallback={<div>로딩 중...</div>}>
                  <Await
                    resolve={loaded.tags}
                    errorElement={
                      <div className="py-20 text-center">
                        <FilePlus className="text-3xl text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          태그를 불러오는 중 오류가 발생했습니다.
                        </h3>
                      </div>
                    }
                  >
                    {(tags) => <TagFilterButton tags={tags} />}
                  </Await>
                </Suspense>
              </div>
            </div>
          </div>
        </header>

        {/* await loaded questions promise */}
        <Suspense fallback={<div>로딩 중...</div>}>
          <Await
            resolve={loaded.question}
            errorElement={
              <div className="py-20 text-center">
                <FilePlus className="text-3xl text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  문제를 불러오는 중 오류가 발생했습니다.
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  다시 시도해 주세요.
                </p>
              </div>
            }
          >
            {({ items, total }) => {
              return loaded.page === 1 && items.length === 0 ? (
                <div className="flex flex-col items-center py-20">
                  <FilePlus className="text-3xl text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    문제가 없습니다.
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    문제를 새로 만들어 보아요!
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/q/new"
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <PlusIcon
                        className="w-5 h-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      만들기
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="-mx-4 divide-y divide-gray-200 ">
                    {items.map((item) => (
                      <li key={item.public_id}>
                        <Link
                          className="block hover:bg-gray-50"
                          to={`/q/edit/${item.public_id}`}
                        >
                          <div className="flex items-center px-4 py-4 sm:px-6">
                            <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                              <div className="truncate">
                                <div className="flex text-sm">
                                  <p className="m-0 font-medium truncate">
                                    {item.content.message}
                                  </p>
                                </div>
                                <div className="flex mt-2">
                                  <div className="flex items-center text-sm font-light text-gray-500">
                                    <Calendar
                                      className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <Tooltip
                                      title={
                                        <span className="text-sm">
                                          {dayjs(item.updated_at).format(
                                            "YYYY년 MM월 DD일 HH:mm:ss"
                                          )}
                                        </span>
                                      }
                                    >
                                      <span className="text-sm leading-none">
                                        {dayjs(item.updated_at).fromNow()}에
                                        업데이트 됨
                                      </span>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-5">
                              <ChevronRightIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col items-center justify-center my-4">
                    <Pagination
                      size="small"
                      defaultCurrent={loaded.page}
                      pageSize={numberPerPage}
                      total={total}
                      onChange={(e: any) => {
                        const dest = new URL(document.location.href);
                        dest.searchParams.set("p", e.toString());
                        navigate(`${dest.pathname}${dest.search}`);
                      }}
                    />
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </MobileLayout>
  );
}
