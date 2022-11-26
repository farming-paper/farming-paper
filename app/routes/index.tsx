import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "flowbite-react";

export async function loader() {
  return json({ name: "Hello, World!" });
}

export default function Index() {
  const data = useLoaderData();

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="p-10"
    >
      <h1 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
        문제를 풀 시간입니다.
      </h1>
      <ul className="flex flex-wrap items-stretch w-full gap-5">
        <li>
          <Link to="/learn/adsp">
            <Button color="gray">
              ADSP
              <ArrowRightIcon className="w-4 h-4 ml-2"></ArrowRightIcon>
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
