import {
  CalendarOutlined,
  CloseCircleFilled,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { defer } from "@remix-run/server-runtime";
import { Button, Pagination, Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { PartialDeep } from "type-fest";
import { getSessionWithProfile } from "~/auth/get-session";
import DateFilterButton from "~/common/components/DateFilterButton";
import TagFilterButton from "~/common/components/TagFilterButton";
import { createQuestion } from "~/question/create";
import type { Question } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import { dayjs, withDurationLog } from "~/util";

const numberPerPage = 10;

export async function getMyTagNames({ request }: { request: Request }) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();

  const tagsRes = await withDurationLog(
    "get_tags_by_creator",
    db
      .from("tags")
      .select("public_id, name")
      .eq("creator", profile.id)
      .is("deleted_at", null)
  );

  if (tagsRes.error) {
    throw new Response(tagsRes.error.message, { status: 500 });
  }

  return tagsRes.data.map((tag) => ({
    publicId: tag.public_id,
    name: tag.name || "",
  }));
}

export async function getMyQuestions({
  page,
  request,
}: {
  page: number;
  request: Request;
}) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();

  const questionsRes = await withDurationLog(
    "get_q_by_creator",
    db
      .from("questions")
      .select("*", { count: "estimated" })
      .eq("creator", profile.id)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .range((page - 1) * numberPerPage, page * numberPerPage - 1)
  );

  if (questionsRes.error) {
    throw new Response(questionsRes.error.message, { status: 500 });
  }

  if (questionsRes.count === null) {
    throw new Response("questionsRes.count is null", { status: 500 });
  }

  return {
    items: questionsRes.data.map((q) => ({
      ...q,
      content: createQuestion(q.content as PartialDeep<Question>),
    })),
    total: questionsRes.count,
  };
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const pageStr = url.searchParams.get("p");

  const page = Number.parseInt(pageStr || "1");
  if (Number.isNaN(page)) {
    throw new Response("page is NaN", { status: 400 });
  }

  return defer({
    question: getMyQuestions({ page, request }),
    page,
    tags: getMyTagNames({ request }),
  });
}

export default function QuestionList() {
  const loaded = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col p-4">
      <header className="flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {!search && (
            <motion.div
              className="overflow-hidden"
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
                <Button type="primary" icon={<PlusOutlined />}>
                  추가
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* <div className="flex items-center justify-between"></div> */}
        <Form
          className={twMerge(
            "flex items-center mt-4 transition",
            search && "mt-0"
          )}
        >
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="peer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-offset-0 focus:border-green-500 focus:ring-green-500 block w-full pl-10 p-2.5"
              placeholder="내용 및 정답 검색..."
              required
              value={search}
              onChange={(e) => {
                console.log(e.target.value, e.nativeEvent);
                setSearch(e.target.value);
              }}
            />
            <button
              type="button"
              className={twMerge(
                "absolute inset-y-0 right-0 hidden items-center text-gray-500 transition hover:text-gray-900 pr-3",
                search && "flex"
              )}
              onClick={() => setSearch("")}
            >
              <CloseCircleFilled className="w-4 h-4" />
            </button>
          </div>
        </Form>

        <div className="-mx-4 overflow-auto scroll">
          <div className="p-4">
            <div className="flex min-w-full gap-2 align-middle whitespace-nowrap">
              <DateFilterButton />
              <TagFilterButton
                tags={loaded.tags}
                onChangeSeletedTag={(e) => {
                  // console.log(e);
                }}
              />
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
              <FileAddOutlined className="text-3xl text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                문제를 불러오는 중 오류가 발생했습니다.
              </h3>
              <p className="mt-1 text-xs text-gray-500">다시 시도해 주세요.</p>
            </div>
          }
        >
          {({ items, total }) => {
            return loaded.page === 1 && items.length === 0 ? (
              <div className="py-20 text-center">
                <FileAddOutlined className="text-3xl text-gray-400" />
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
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                                  <CalendarOutlined
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
                    defaultCurrent={loaded.page}
                    pageSize={numberPerPage}
                    total={total}
                    onChange={(e) => {
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
  );
}
