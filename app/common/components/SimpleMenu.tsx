import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useSearchParams } from "@remix-run/react";
import { Calendar, ChevronDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { dayjs } from "~/util";
import type { DatePickerValue } from "./DatePicker";
import DatePicker from "./DatePicker";

export const SimplePopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const datePickerValue: DatePickerValue = useMemo(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const singleDate = searchParams.get("single_date");

    if (start && end) {
      return {
        type: "range",
        start: dayjs(start).toDate(),
        end: dayjs(end).toDate(),
      };
    }

    if (singleDate) {
      return {
        type: "single",
        date: dayjs(singleDate).toDate(),
      };
    }

    return {
      type: "none",
    };
  }, [searchParams]);

  const onChange = useCallback(
    (value: DatePickerValue) => {
      if (value.type === "none") {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("start");
          next.delete("end");
          next.delete("single_date");

          return next;
        });
        return;
      }

      if (value.type === "single") {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("single_date", dayjs(value.date).format("YYYY-MM-DD"));
          next.delete("start");
          next.delete("end");
          return next;
        });
        return;
      }

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("start", dayjs(value.start).format("YYYY-MM-DD"));
        next.set("end", dayjs(value.end).format("YYYY-MM-DD"));
        next.delete("single_date");
        return next;
      });

      return;
    },
    [setSearchParams]
  );

  const buttonText = useMemo(() => {
    if (datePickerValue.type === "none") {
      return "생성일";
    }

    if (datePickerValue.type === "single") {
      return dayjs(datePickerValue.date).format("YYYY/MM/DD");
    }

    return `${dayjs(datePickerValue.start).format("YYYY/MM/DD")} - ${dayjs(
      datePickerValue.end
    ).format("YYYY/MM/DD")}`;
  }, [datePickerValue]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          className: twMerge(
            "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-100",
            datePickerValue.type !== "none" &&
              "bg-green-50 text-green-700 border-green-500"
          ),
        })}
      >
        <Calendar className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
        <span
          className={twMerge(
            "mt-px font-mono",
            datePickerValue.type !== "none" && "text-xs"
          )}
        >
          {buttonText}
        </span>
        <ChevronDown className="w-3 h-3 ml-2 -mr-1" aria-hidden="true" />
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "max-content",
            }}
            {...getFloatingProps({
              className: "bg-white rounded-md shadow-lg",
            })}
          >
            <DatePicker value={datePickerValue} onChange={onChange} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default SimplePopover;
