import { Outlet } from "@remix-run/react";

export default function Page() {
  return (
    <div className="p-4">
      <header className="flex items-center gap-4 my-2">
        <h1 className="m-0 text-xl font-medium">
          영어 단어 → 빈칸 예문 + 해석
        </h1>
      </header>
      <Outlet />
    </div>
  );
}
