import {
  BulbOutlined,
  FileAddOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "@remix-run/react";

const links = [
  {
    to: "/q/solve",
    icon: <BulbOutlined />,
    label: "풀기",
  },
  {
    to: "/q/list",
    icon: <OrderedListOutlined />,
    label: "목록",
  },
  {
    to: "/q/new",
    icon: <FileAddOutlined />,
    label: "생성",
  },
  {
    to: "/account",
    icon: <UserOutlined />,
    label: "계정",
  },
];

export default function BottomNav() {
  return (
    <section
      id="bottom-navigation"
      className="fixed inset-x-0 bottom-0 left-0 right-0 z-10 block max-w-md mx-auto border-t shadow-lg bg-white/50 backdrop-blur"
    >
      <div id="tabs" className="flex justify-between">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="justify-center inline-block w-full pt-2 pb-1 text-center transition focus:text-green-500 hover:text-green-500"
          >
            <span className="text-xl opacity-60">{link.icon}</span>
            <span className="block text-xs tab tab-explore">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
