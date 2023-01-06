import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Pagination } from "antd";
import dayjs from "dayjs";
import { getSessionWithProfile } from "~/auth/get-session";
import { createQuestion } from "~/question/create";
import type { Question } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { PartialDeep } from "~/types";

const numberPerPage = 10;

export async function loader({ request, params }: LoaderArgs) {
  const response = new Response();
  const page = Number.parseInt(params.page || "1");
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();

  const questionsRes = await db
    .from("questions")
    .select("*", { count: "exact" })
    .eq("creator", profile.id)
    .order("updated_at", { ascending: false })
    .range((page - 1) * numberPerPage, page * numberPerPage - 1);

  if (questionsRes.error) {
    throw new Error(questionsRes.error.message);
  }

  if (questionsRes.count === null) {
    throw new Error("questionsRes.count is null");
  }

  return json({
    items: questionsRes.data.map((q) => ({
      ...q,
      content: createQuestion(q.content as PartialDeep<Question>),
    })),
    total: questionsRes.count,
  });
}

export const meta: MetaFunction = ({ params }) => {
  const page = Number.parseInt(params.page || "1");

  return {
    title: `문제 ${page}p | Farming Paper`,
  };
};

export default function QuestionList() {
  const loaded = useLoaderData<typeof loader>();
  const params = useParams();
  const page = Number.parseInt(params.page || "1");
  const nav = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="flex items-end gap-4 mx-5 my-5">
        <h1 className="m-0 text-xl font-medium leading-none">문제 리스트</h1>
        <p className="m-0 leading-none text-gray-400">{page}p</p>
      </header>
      <ul className="divide-y divide-gray-200">
        {loaded.items.map((item) => (
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
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>
                          {dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                        </span>
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
          defaultCurrent={page}
          pageSize={numberPerPage}
          total={loaded.total}
          onChange={(e) => {
            nav(`/q/list/${e}`);
          }}
        />
      </div>
    </div>
  );
}
