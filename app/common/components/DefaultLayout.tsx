import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function DefaultLayout({
  children,
  footer,
  header,

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
    <div className={twMerge("min-h-[100dvh] relative", className)}>
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        {header}
      </div>
      {children}
      {footer}
    </div>
  );
}
