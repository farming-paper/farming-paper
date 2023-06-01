import type { Calendar } from "@rehookify/datepicker";
import { useDatePicker } from "@rehookify/datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { dayjs } from "~/util";

export type DatePickerValue =
  | {
      type: "range";
      start: Date;
      end: Date;
    }
  | {
      type: "single";
      date: Date;
    }
  | {
      type: "none";
    };

const DatePicker: React.FC<{
  value: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
}> = ({ value, onChange }) => {
  const selectedDates = useMemo(() => {
    if (value.type === "none") {
      return [];
    }

    if (value.type === "single") {
      return [value.date];
    }

    return [value.start, value.end];
  }, [value]);

  const onDatesChange = useCallback(
    (dates: Date[]) => {
      if (dates.length === 0) {
        onChange({ type: "none" });
        return;
      }

      if (dates.length === 1) {
        onChange({ type: "single", date: dates[0] as Date });
        return;
      }

      onChange({
        type: "range",
        start: dates[0] as Date,
        end: dates[1] as Date,
      });
    },
    [onChange]
  );

  const {
    data: { weekDays, calendars },
    propGetters: { dayButton, previousMonthButton, nextMonthButton },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    dates: { selectSameDate: true, toggle: true, mode: "range" },
    locale: {
      locale: "ko-KR",
      day: "numeric",
    },
  });

  const { month, year, days } = calendars[0] as Calendar;

  return (
    <section>
      <header className="m-3">
        <div className="flex items-center">
          <button
            {...previousMonthButton()}
            className="p-3 transition hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="inline-flex items-center justify-center flex-1 mb-0">
            {year} {month}
          </p>
          <button
            {...nextMonthButton()}
            className="p-3 transition hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="m-3 mt-2 rounded-md">
        <ul className="grid grid-cols-7 my-3 text-center">
          {weekDays.map((day) => (
            <li key={`${year}-${month}-${day}`}>{day}</li>
          ))}
        </ul>
        <ul className="grid grid-cols-7 gap-y-1">
          {days.map((dpDay) => (
            <li key={dpDay.$date.toISOString()}>
              <button {...dayButton(dpDay)} className="group">
                <span
                  className={twMerge(
                    "text-sm w-10 h-8 inline-flex items-center justify-center transform transition-colors text-gray-600",
                    !dpDay.inCurrentMonth && "text-gray-300",
                    !dpDay.range && "group-hover:bg-gray-100",
                    dpDay.now && "text-green-700 font-bold",
                    (dpDay.range === "will-be-in-range" ||
                      dpDay.range === "will-be-range-start" ||
                      dpDay.range === "will-be-range-end") &&
                      "bg-green-100",
                    (dpDay.range === "in-range" ||
                      dpDay.range === "range-start" ||
                      dpDay.range === "range-end" ||
                      dpDay.range === "range-start range-end") &&
                      "bg-green-200 text-black",
                    (dpDay.range === "range-start" ||
                      dpDay.range === "will-be-range-start") &&
                      "rounded-l-sm",
                    (dpDay.range === "range-end" ||
                      dpDay.range === "will-be-range-end") &&
                      "rounded-r-sm",
                    dpDay.range === "range-start range-end" && "rounded-sm",
                    value.type === "single" &&
                      dayjs(dpDay.$date).isSame(value.date, "day") &&
                      "bg-green-200"
                    // dpDay.selected && "bg-green-500 text-white"
                  )}
                >
                  {dpDay.day.replace(/일/g, "")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DatePicker;
