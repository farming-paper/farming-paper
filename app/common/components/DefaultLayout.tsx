import type { ReactNode } from "react";

export default function DefaultLayout({
  children,
  footer,
  header,
  sidebarBottom,
  sidebarTop,
}: {
  children: ReactNode;
  sidebarTop?: ReactNode;
  sidebarBottom?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between flex-none w-12 h-screen text-gray-300 bg-gray-700">
        <div>{sidebarTop}</div>
        <div>{sidebarBottom}</div>
      </div>

      <div className="flex flex-col flex-1 min-h-screen">
        {header}
        {children}
        {footer}
      </div>
    </div>
  );
}
