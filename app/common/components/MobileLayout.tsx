import { Bars3Icon } from "@heroicons/react/24/outline";

import { useAtom } from "jotai";
import type { ReactNode } from "react";
import { useEffect } from "react";
import openSideMenuAtom from "~/atoms/openSideMenu";
import SideMenu from "./SideMenu";

export default function MobileLayout({ children }: { children: ReactNode }) {
  const [_, setOpenSideMenu] = useAtom(openSideMenuAtom);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const status = params.get("status");
  //   if (status === "already_logged_in") {
  //     message.info("이미 로그인되어 있습니다.");
  //   }
  // }, [message]);

  // set OpenSideMenu to false when the history changes
  useEffect(() => {
    const setOpensideMenuFalse = () => setOpenSideMenu(false);
    window.addEventListener("popstate", setOpensideMenuFalse);

    return () => {
      window.removeEventListener("popstate", setOpensideMenuFalse);
    };
  }, [setOpenSideMenu]);

  return (
    <>
      <SideMenu />
      <div className="px-4 py-2.5">
        <button
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setOpenSideMenu(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
      {children}
    </>
  );
}
