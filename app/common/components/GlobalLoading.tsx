import { useTransition } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

function GlobalLoading() {
  const transition = useTransition();
  const active = transition.state !== "idle";

  return (
    <div
      role="progressbar"
      aria-valuetext={active ? "Loading" : undefined}
      aria-hidden={!active}
      className={twMerge(
        "pointer-events-none fixed inset-0 z-50 p-4 transition-all duration-300 ease-out bg-white/70 flex items-center justify-center",
        active ? "opacity-100" : "opacity-0"
      )}
    >
      <svg
        className="h-7 w-7 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
      >
        <circle
          className="stroke-green-600/25"
          cx={12}
          cy={12}
          r={10}
          strokeWidth={4}
        />
        <path
          className="fill-green-600"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export default GlobalLoading;
