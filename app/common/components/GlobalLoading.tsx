import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

function GlobalLoading() {
  const navigation = useNavigation();

  const loading = navigation.state !== "idle" && !navigation.formAction;

  return (
    <div
      role="progressbar"
      aria-valuetext={loading ? "Loading" : undefined}
      aria-hidden={!loading}
      className={twMerge(
        "pointer-events-none fixed inset-0 z-50 p-4 transition-all duration-75 ease-out bg-white/70 flex items-center justify-center text-3xl text-primary-500",
        loading ? "opacity-100" : "opacity-0"
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}

export default GlobalLoading;
