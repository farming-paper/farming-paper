import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function SelectEngSentencesList({
  onSelected,
  sentences,
}: {
  sentences: string[];
  onSelected: (sentence: string) => void;
}) {
  <ul className="-mx-4 divide-y divide-gray-200 ">
    {sentences.map((sentence) => (
      <li key={sentence}>
        <a
          href="#?"
          className="block hover:bg-gray-50"
          onClick={(e) => {
            e.preventDefault();
            onSelected(sentence);
          }}
        >
          <div className="flex items-center px-4 py-4 sm:px-6">
            <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
              <div className="truncate">
                <div className="flex text-sm">
                  <p className="m-0 font-medium truncate">{sentence}</p>
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
        </a>
      </li>
    ))}
  </ul>;
}
