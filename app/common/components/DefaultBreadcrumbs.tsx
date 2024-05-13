import type { BreadcrumbsProps } from "@nextui-org/react";
import { Breadcrumbs } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

export default function DefaultBreadcrumbs(props: BreadcrumbsProps) {
  return (
    <Breadcrumbs
      {...props}
      className={twMerge(
        "py-2 px-1 max-w-[calc(700px+1.25rem)] mx-auto pointer-events-auto",
        props.className
      )}
      itemClasses={{
        ...props.itemClasses,
        item: twMerge("px-2 text-default-500", props.itemClasses?.item),
        separator: twMerge("px-0", props.itemClasses?.separator),
      }}
    >
      {props.children}
    </Breadcrumbs>
  );
}
