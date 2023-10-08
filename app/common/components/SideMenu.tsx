import {
  PlayCircleFilled,
  TagOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "@remix-run/react";
import { useAtom } from "jotai";
import { Fragment, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import openSideMenuAtom from "~/atoms/openSideMenu";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

const links = [
  {
    to: "/q/solve",
    icon: PlayCircleFilled,
    name: "Go!",
    primary: true,
  },
  {
    to: "/q/list",
    icon: UnorderedListOutlined,
    name: "문제 관리",
  },
  {
    to: "/tag/list",
    icon: TagOutlined,
    name: "태그 관리",
  },
  {
    to: "/account",
    icon: UserOutlined,
    name: "계정",
  },
];

export default function SideMenu() {
  const [openSideMenu, setOpenSideMenu] = useAtom(openSideMenuAtom);
  const close = useMemo(() => {
    return () => setOpenSideMenu(false);
  }, [setOpenSideMenu]);

  return (
    <Transition.Root show={openSideMenu} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={close}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex flex-col px-6 pt-2 pb-4 overflow-y-auto bg-primary-700 grow gap-y-5">
                <div className="flex items-center h-16 text-3xl font-bold tracking-tight text-white shrink-0">
                  Farming Paper
                </div>
                <nav className="flex flex-col flex-1">
                  <ul className="flex flex-col flex-1 gap-y-7">
                    <li>
                      <ul className="-mx-2 space-y-1">
                        {links.map((item) => (
                          <li key={item.to}>
                            <NavLink to={item.to} onClick={close}>
                              {({ isActive }) => {
                                return (
                                  <span
                                    className={twMerge(
                                      "text-primary-200 hover:text-white hover:bg-primary-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition items-center",
                                      item.primary &&
                                        "text-lg  text-primary-100 px-2 py-3",
                                      isActive && "bg-primary-800 text-white"
                                    )}
                                  >
                                    <item.icon
                                      className={twMerge(
                                        isActive
                                          ? "text-white"
                                          : "text-primary-200 group-hover:text-white",
                                        "shrink-0 text-xl w-6 h-6 inline-flex justify-center transition"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </span>
                                );
                              }}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-primary-200">
                        Your teams
                      </div>
                      <ul className="mt-2 -mx-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={twMerge(
                                team.current
                                  ? "bg-primary-800 text-white"
                                  : "text-primary-200 hover:text-white hover:bg-primary-800",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-primary-400 bg-primary-500 text-[0.625rem] font-medium text-white">
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="flex p-2 -mx-2 text-sm font-semibold leading-6 rounded-md text-primary-200 group gap-x-3 hover:bg-primary-800 hover:text-white"
                      >
                        <Cog6ToothIcon
                          className="w-6 h-6 text-primary-200 shrink-0 group-hover:text-white"
                          aria-hidden="true"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
