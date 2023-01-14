import { Outlet } from "@remix-run/react";

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="my-2 text-xl font-medium">로그인 중입니다...</h1>
      <Outlet />
    </div>
  );
}
