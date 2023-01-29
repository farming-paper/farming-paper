import { useTransition } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import Loader from "./Loader";

function GlobalLoading() {
  const transition = useTransition();
  const active = transition.state !== "idle";

  return (
    <div
      role="progressbar"
      aria-valuetext={active ? "Loading" : undefined}
      aria-hidden={!active}
      className={twMerge(
        "pointer-events-none fixed inset-0 z-50 p-4 transition-all duration-300 ease-out bg-white/70 flex items-center justify-center text-3xl",
        active ? "opacity-100" : "opacity-0"
      )}
    >
      <Loader />
    </div>
  );
}

export default GlobalLoading;
