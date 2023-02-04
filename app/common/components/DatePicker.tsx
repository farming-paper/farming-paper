import type { Calendar } from "@rehookify/datepicker";
import { useDatePicker } from "@rehookify/datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const DatePicker = () => {
  const [selectedDates, onDatesChange] = useState<Date[]>([]);
  const {
    data: { weekDays, calendars },
    propGetters: { dayButton, previousMonthButton, nextMonthButton },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    dates: { toggle: true, mode: "range" },
    locale: {
      locale: "ko-KR",
      day: "numeric",
    },
  });

  const { month, year, days } = calendars[0] as Calendar;

  const onDayClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, date: Date) => {
      // In case you need any action with evt
      e.stopPropagation();

      // In case you need any additional action with date
      console.log(date);
    },
    []
  );

  useEffect(() => {
    console.log("days", days);
  }, [days]);

  return (
    <section>
      <header>
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
        <ul className="grid grid-cols-7 my-3 text-center">
          {weekDays.map((day) => (
            <li key={`${year}-${month}-${day}`}>{day}</li>
          ))}
        </ul>
      </header>
      <ul className="grid grid-cols-7 gap-y-1">
        {days.map((dpDay) => (
          <li key={dpDay.$date.toISOString()} className={dpDay.range}>
            <button
              {...dayButton(dpDay, { onClick: onDayClick })}
              className="group"
            >
              <span
                className={twMerge(
                  "text-sm w-10 h-8 inline-flex items-center justify-center transform transition-colors",
                  !dpDay.inCurrentMonth && "text-gray-300",
                  !dpDay.range && "group-hover:bg-gray-100",
                  !dpDay.range &&
                    dpDay.now &&
                    "bg-green-700 group-hover:bg-green-600 text-white rounded-sm",

                  (dpDay.range === "will-be-in-range" ||
                    dpDay.range === "will-be-range-start" ||
                    dpDay.range === "will-be-range-end") &&
                    "bg-green-100",
                  (dpDay.range === "in-range" ||
                    dpDay.range === "range-start" ||
                    dpDay.range === "range-end" ||
                    dpDay.range === "range-start range-end") &&
                    "bg-green-200",
                  dpDay.range &&
                    dpDay.now &&
                    "bg-green-300 group-hover:bg-green-200 text-black rounded-sm",
                  (dpDay.range === "range-start" ||
                    dpDay.range === "will-be-range-start") &&
                    "rounded-l-full",
                  (dpDay.range === "range-end" ||
                    dpDay.range === "will-be-range-end") &&
                    "rounded-r-full",
                  dpDay.range === "range-start range-end" && "rounded-full"
                  // dpDay.selected && "bg-green-500 text-white"
                )}
              >
                {dpDay.day.replace(/일/g, "")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DatePicker;
