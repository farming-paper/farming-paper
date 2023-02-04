import { CloseCircleFilled } from "@ant-design/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Await, Form } from "@remix-run/react";
import { disassembleHangul } from "@toss/hangul";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Tag } from "lucide-react";
import {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type FilterTag = {
  publicId: string;
  name: string;
};

function selectedTagsReducer(
  state: FilterTag[],
  action:
    | {
        type: "add";
        tag: FilterTag;
      }
    | {
        type: "remove";
        publicId: string;
      }
) {
  switch (action.type) {
    case "add":
      return [...state, action.tag];
    case "remove":
      return state.filter((tag) => tag.publicId !== action.publicId);
    default:
      throw new Error();
  }
}

const TagFilterButton: React.FC<{
  tags: Promise<FilterTag[]>;
  onChangeSeletedTag: (tags: FilterTag[]) => void;
}> = ({ onChangeSeletedTag, tags }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, dispatchSelectedTags] = useReducer(
    selectedTagsReducer,
    []
  );

  const okButtonRef = useRef(null);

  const filtered = useMemo(
    async () =>
      (await tags).filter((tag) => {
        if (search === "") {
          return true;
        }

        // disassembleHangul
        const disassembledSearch = disassembleHangul(search);
        const disassembledTag = disassembleHangul(tag.name);

        return disassembledTag.includes(disassembledSearch);
      }),
    [search, tags]
  );

  useEffect(() => {
    onChangeSeletedTag(selectedTags);
  }, [onChangeSeletedTag, selectedTags]);

  const handleToggleTag = useCallback(
    (tag: FilterTag) => {
      if (selectedTags.find((t) => t.publicId === tag.publicId)) {
        dispatchSelectedTags({ type: "remove", publicId: tag.publicId });
      } else {
        dispatchSelectedTags({ type: "add", tag });
      }
    },
    [selectedTags]
  );

  const [isSearchFocus, setIsSearchFocus] = useState(false);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocus(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocus(false);
  }, []);

  const hideHeaderFromSearch = useMemo(() => {
    return isSearchFocus || search !== "";
  }, [isSearchFocus, search]);

  return (
    <>
      <button
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Tag className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
        태그
        <ChevronDown className="w-3 h-3 ml-2 -mr-1" aria-hidden="true" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={okButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity sm:bg-gray-500/75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10">
            <div className="flex justify-center h-full text-center sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col w-full px-4 pt-4 overflow-hidden text-left transition-all transform shadow-xl bg-white/80 sm:bg-white backdrop-blur-lg sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    {!hideHeaderFromSearch && (
                      <motion.div
                        className="flex-none"
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
                          <Dialog.Title
                            as="h3"
                            className="mb-0 text-lg font-medium leading-6 text-gray-900"
                          >
                            태그 필터 설정
                          </Dialog.Title>
                          <Button
                            size="small"
                            className="px-3 py-2 transition rounded-md hover:bg-white/50 hover:shadow"
                            onClick={() => setOpen(false)}
                            ref={okButtonRef}
                          >
                            완료
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Form
                    className={twMerge(
                      "flex items-center mt-3 transition",
                      hideHeaderFromSearch && "mt-0"
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
                        placeholder="검색..."
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        required
                        value={search}
                        onChange={(e) => {
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
                  <hr className="mt-4 mb-0 -mx-4" />

                  <Suspense fallback={<div>로딩중...</div>}>
                    <Await resolve={filtered}>
                      {(filtered) => {
                        return (
                          <ul className="grid min-h-0 grid-cols-2 gap-3 p-3 mb-0 -mx-4 overflow-y-auto ">
                            {filtered.map((tag) => (
                              <li
                                key={tag.publicId}
                                className={twMerge(
                                  "transition bg-white shadow-sm hover:cursor-pointer border hover:bg-gray-50 hover:border-green-400",
                                  selectedTags.includes(tag) &&
                                    "border-green-500"
                                )}
                                onClick={() => {
                                  handleToggleTag(tag);
                                  setSearch("");
                                }}
                              >
                                <div className="flex items-center px-4 py-4 sm:px-6">
                                  <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                                    <div className="truncate">
                                      <div className="flex text-sm">
                                        <p className="m-0 font-medium truncate">
                                          {tag.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 ml-5">
                                    <Check
                                      className={twMerge(
                                        "w-5 h-5 text-gray-200",
                                        selectedTags.includes(tag) &&
                                          "text-green-500"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        );
                      }}
                    </Await>
                  </Suspense>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default TagFilterButton;
