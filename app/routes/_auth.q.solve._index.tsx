import { QuestionCircleFilled } from "@ant-design/icons";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Tooltip } from "antd";
import { getSessionWithProfile } from "~/auth/get-session";
import NumberBall from "~/common/components/NumberBall";
import prisma from "~/prisma-client.server";
import type { ITagWithCount } from "~/types";
import { bigintToNumber, removeNullDeep } from "~/util";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const tags = await prisma.tags.findMany({
    where: {
      creator: profile.id,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      public_id: true,
      desc: true,
      _count: {
        select: {
          tags_questions_relation: {
            where: {
              questions: {
                deleted_at: null,
              },
            },
          },
        },
      },
    },
  });

  const tagsForSolve: ITagWithCount[] = tags.map((t) =>
    removeNullDeep({
      count: t._count.tags_questions_relation,
      id: bigintToNumber(t.id),
      name: t.name || "",
      publicId: t.public_id,
      desc: t.desc,
    })
  );

  return json({ tagsForSolve });
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col p-4">
      <header className="flex items-end gap-4 my-2">
        <h1 className="m-0 text-xl font-medium">문제 풀기</h1>
      </header>
      <p className="flex items-center gap-2 text-gray-500">
        <span>태그를 선택하세요.</span>
        <span className="text-sm text-gray-300">
          <Tooltip
            title={
              <span className="break-keep">
                문제에 태그를 먼저 설정해야 풀 수 있습니다.
              </span>
            }
          >
            <QuestionCircleFilled className="w-4 h-4" />
          </Tooltip>
        </span>
      </p>
      <div className="grid grid-cols-2 gap-4 ">
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
                  <NumberBall>{tag.count}</NumberBall>
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
