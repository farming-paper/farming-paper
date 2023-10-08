import { useNavigation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import Loader from "./Loader";

function GlobalLoading() {
  const navigation = useNavigation();

  const loading = navigation.state !== "idle" && !navigation.formAction;

  return (
    <div
      role="progressbar"
      aria-valuetext={loading ? "Loading" : undefined}
      aria-hidden={!loading}
      className={twMerge(
        "pointer-events-none fixed inset-0 z-50 p-4 transition-all duration-300 ease-out bg-white/70 flex items-center justify-center text-3xl",
        loading ? "opacity-100" : "opacity-0"
      )}
    >
      <Loader />
    </div>
  );
}

export default GlobalLoading;
