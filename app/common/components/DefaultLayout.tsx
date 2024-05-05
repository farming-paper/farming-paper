import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function DefaultLayout({
  children,
  footer,
  header,
  sidebarBottom,
  sidebarTop,
  className,
}: {
  children: ReactNode;
  sidebarTop?: ReactNode;
  sidebarBottom?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex">
      <div className="sticky top-0 flex flex-col justify-between flex-none w-12 h-screen text-gray-300 bg-gray-700">
        <div>{sidebarTop}</div>
        <div>{sidebarBottom}</div>
      </div>

      <div className={twMerge("flex-1 min-h-screen", className)}>
        {header}
        {children}
        {footer}
      </div>
    </div>
  );
}
