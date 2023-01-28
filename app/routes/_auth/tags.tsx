import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { Button } from "antd";
import { useMemo, useState } from "react";
import { getQuestionGroups } from "~/question/utils";

export async function loader() {
  return redirect("/q/solve");
}

export default function Index() {
  const [questions] = useState(getQuestionGroups());

  const links = useMemo(
    () =>
      [...questions.entries()].map(([key, { name, buttonContent }]) => (
        <li key={key}>
          <Link to={`/learn/${key}`}>
            <Button className="inline-flex items-center gap-2 font-normal">
              {buttonContent ? buttonContent : name}
              <ArrowRightIcon className="w-3 h-3"></ArrowRightIcon>
            </Button>
          </Link>
        </li>
      )),
    [questions]
  );

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="p-4"
    >
      <h1 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
        파밍페이퍼
      </h1>
      <p className="mb-2">
        문제를 풀 시간입니다. 아래 버튼을 눌러 문제를 푸세요.
      </p>
      <ul className="flex flex-wrap items-stretch w-full gap-2 mb-5">
        {links}
      </ul>
      <Link
        to="//github.com/echoja/learning"
        className="text-blue-600 hover:underline"
      >
        GitHub로 가기
      </Link>
    </div>
  );
}
