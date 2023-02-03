import { Dialog, Transition } from "@headlessui/react";
import { ChevronDown, Tag } from "lucide-react";
import { Fragment, useRef, useState } from "react";

const SimpleModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

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
          initialFocus={cancelButtonRef}
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
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex justify-center h-full p-1 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col px-4 pt-1 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <header className="flex items-center justify-between">
                    <div className="flex-none">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        돌아가기
                      </button>
                    </div>

                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      태그 필터 설정
                    </Dialog.Title>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Deactivate
                    </button>
                  </header>

                  <div className="flex-1 mt-2 overflow-y-auto">
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SimpleModal;
