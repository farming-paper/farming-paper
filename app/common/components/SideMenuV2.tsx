import { NavLink } from "@remix-run/react";
import { FileText } from "lucide-react";
import { twMerge } from "tailwind-merge";

const links = [
  {
    to: "/dashboard",
    icon: FileText,
    name: "대시보드",
  },
  // {
  //   to: "/tag/list",
  //   icon: Tags,
  //   name: "태그 관리",
  // },
];

export default function SideMenuV2() {
  return (
    <nav>
      <ul className="flex flex-col divide-y divide-gray-600">
        {links.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to}>
              {({ isActive }) => {
                return (
                  <>
                    <span
                      className={twMerge(
                        "h-10 flex w-full items-center justify-center",
                        isActive && "text-white bg-primary-500"
                      )}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
