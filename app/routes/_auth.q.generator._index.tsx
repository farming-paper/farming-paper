import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

type Item = {
  url: string;
  title: string;
  desc: string;
};

const items: Item[] = [
  // {
  //   url: "/q/generator/english-word/input",
  //   title: "영어 단어 → 빈칸 예문 + 해석",
  //   desc: "영어 단어 기반 문제를 생성합니다. 예문은 Oxford Dictionary를 사용하고 해석은 Naver Papago를 사용합니다.",
  // },
];

export default function Page() {
  return (
    <div className="flex flex-col p-4">
      <header className="flex items-center gap-4 my-2">
        <h1 className="m-0 text-xl font-medium">문제 생성기</h1>
      </header>
      <p className="m-0 text-gray-700">문제를 쉽게 만들기 위한 도구들입니다.</p>
      <hr className="mt-6 -mx-4" />
      <ul className="-mx-4 divide-y divide-gray-200 ">
        {items.map((item) => (
          <li key={item.url}>
            <Link className="block hover:bg-gray-50" to={item.url}>
              <div className="flex items-center px-4 py-4">
                <div className="flex-1 min-w-0">
                  <p className="mb-2 font-medium truncate">{item.title}</p>
                  <p className="m-0 text-sm font-light text-gray-500 break-keep">
                    {item.desc}
                  </p>
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
    </div>
  );
}
