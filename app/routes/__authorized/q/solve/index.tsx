import { QuestionCircleFilled } from "@ant-design/icons";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Tooltip } from "antd";
import { getSessionWithProfile } from "~/auth/get-session";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database } from "~/supabase/generated/supabase-types";
import type { ITagForSolve } from "~/types";

export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });
  const db = getServerSideSupabaseClient();

  // TODO: function 선언 시 리턴 타입 설정에서 nullable 을 설정할 수 없음. desc 같은 경우 Null 이 올 수도 있지만 타입은 그렇지 않음.
  // TODO: 타입 수정이 필요함
  const tagsRes = (await db.rpc("get_solving_tags_by_creator_id", {
    p_creator: profile.id,
  })) as PostgrestSingleResponse<
    Database["public"]["Functions"]["get_solving_tags_by_creator_id"]["Returns"]
  >;

  if (tagsRes.error) {
    throw new Response(tagsRes.error.message, {
      status: tagsRes.status,
    });
  }

  const tagsForSolve: ITagForSolve[] = tagsRes.data.map((t) => ({
    count: t.count,
    id: t.id,
    name: t.name,
    publicId: t.public_id,
    desc: t.desc,
  }));

  return json({ tagsForSolve });
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col">
      <header className="flex items-end gap-4 mx-5 my-5">
        <h1 className="m-0 text-xl font-medium leading-none">문제 풀기</h1>
      </header>
      <p className="flex items-center gap-2 mx-5 text-gray-500">
        <span>태그를 선택하세요.</span>
        <span className="text-sm text-gray-300">
          <Tooltip title="문제에 태그를 설정하고,  풀 수 있습니다.">
            <QuestionCircleFilled className="w-4 h-4" />
          </Tooltip>
        </span>
      </p>
      <div className="grid grid-cols-2 gap-4 px-2">
        {loaded.tagsForSolve.map((tag) => (
          <div
            key={tag.publicId}
            className="relative flex items-center px-4 py-3 space-x-3 transition bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:border-green-400"
          >
            <div className="flex-1 min-w-0">
              <Link
                to={`/q/solve/only-one-tag/${tag.publicId}`}
                className="focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="flex items-center gap-1 m-0 text-sm font-medium text-gray-900">
                  <span>{tag.name}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs text-gray-400 bg-gray-100 rounded-full">
                    {tag.count}
                  </span>
                </p>
                {/* <p className="text-sm text-gray-500 truncate">{tag.role}</p> */}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
