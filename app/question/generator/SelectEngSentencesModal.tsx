import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment, useCallback, useRef, useState } from "react";

const steps = [
  { name: "Step 1", href: "#", status: "complete" },
  { name: "Step 2", href: "#", status: "current" },
  { name: "Step 3", href: "#", status: "upcoming" },
  { name: "Step 4", href: "#", status: "upcoming" },
];

export default function SelectEngSentencesModal({
  setOpen,
  open,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cancelButtonRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleCancelButtonClick = useCallback(async () => {
    setCanceling(true);
    await onCancel?.();
    setCanceling(false);
    setOpen(false);
  }, [onCancel, setOpen]);

  const handleSubmitButtonClick = useCallback(async () => {
    setSubmitting(true);
    await onSubmit?.();
    setSubmitting(false);
    setOpen(false);
  }, [setOpen, onSubmit]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={(e) => setOpen(e)}
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
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <nav
                  className="flex items-center justify-center"
                  aria-label="Progress"
                >
                  <p className="text-sm font-medium">
                    Step{" "}
                    {steps.findIndex((step) => step.status === "current") + 1}{" "}
                    of {steps.length}
                  </p>
                  <ol className="flex items-center ml-8 space-x-5">
                    {steps.map((step) => (
                      <li key={step.name}>
                        {step.status === "complete" ? (
                          <a
                            href={step.href}
                            className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
                          >
                            <span className="sr-only">{step.name}</span>
                          </a>
                        ) : step.status === "current" ? (
                          <a
                            href={step.href}
                            className="relative flex items-center justify-center"
                            aria-current="step"
                          >
                            <span
                              className="absolute flex w-5 h-5 p-px"
                              aria-hidden="true"
                            >
                              <span className="w-full h-full bg-indigo-200 rounded-full" />
                            </span>
                            <span
                              className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                              aria-hidden="true"
                            />
                            <span className="sr-only">{step.name}</span>
                          </a>
                        ) : (
                          <a
                            href={step.href}
                            className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400"
                          >
                            <span className="sr-only">{step.name}</span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="w-6 h-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      영어 문장 선택
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleSubmitButtonClick}
                    // loading={submitting}
                    disabled={submitting || canceling}
                  >
                    {submitText}
                  </button>
                  <button
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={handleCancelButtonClick}
                    ref={cancelButtonRef}
                    // loading={canceling}
                    disabled={submitting || canceling}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
