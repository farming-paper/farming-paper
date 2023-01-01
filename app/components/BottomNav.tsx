import { Link } from "@remix-run/react";

export default function BottomNav() {
  return (
    <section
      id="bottom-navigation"
      className="fixed inset-x-0 bottom-0 left-0 right-0 z-10 block max-w-md mx-auto bg-white shadow"
    >
      <div id="tabs" className="flex justify-between">
        <Link
          to={"/q/list"}
          className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
        >
          <span className="block text-xs tab tab-explore">List</span>
        </Link>
        <Link
          to={"/q/new"}
          className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
        >
          <span className="block text-xs tab tab-whishlist">New</span>
        </Link>
        <Link
          to={"/account"}
          className="justify-center inline-block w-full pt-2 pb-1 text-center focus:text-teal-500 hover:text-teal-500"
        >
          <span className="block text-xs tab tab-account">Account</span>
        </Link>
      </div>
    </section>
  );
}
