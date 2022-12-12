import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { Button } from "flowbite-react";
import { useMemo, useState } from "react";
import { getQuestionGroups } from "~/question/utils";

export default function Index() {
  const [questions] = useState(getQuestionGroups());

  const links = useMemo(
    () =>
      [...questions.entries()].map(([key, { name, buttonContent }]) => (
        <li key={key}>
          <Link to={`/learn/${key}`}>
            <Button color="gray" className="font-normal">
              {buttonContent ? buttonContent : name}
              <ArrowRightIcon className="w-4 h-4 ml-2"></ArrowRightIcon>
            </Button>
          </Link>
        </li>
      )),
    [questions]
  );

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="p-10"
    >
      <h1 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
        문제를 풀 시간입니다.
      </h1>
      <ul className="flex flex-wrap items-stretch w-full gap-5">{links}</ul>
    </div>
  );
}
