import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

export default function TagFilterChip({
  name,
  active,
  onClick,
  className,
}: {
  name: string;
  onClick: () => void;
  active: boolean;
  className?: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "solid" : "light"}
      color={active ? "primary" : "default"}
      className={twMerge(
        "border border-dashed  text-sm px-2 py-1.5 min-w-0 h-auto rounded-full",
        active
          ? "font-medium border-transparent"
          : "font-semibold border-gray-300 text-gray-400",
        className
      )}
    >
      {name}
    </Button>
  );
}
