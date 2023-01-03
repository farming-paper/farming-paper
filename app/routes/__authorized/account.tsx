import { useOutletContext } from "@remix-run/react";
import { Button } from "antd";
import { useCallback } from "react";
import type { IOutletProps } from "~/types";

export default function Account() {
  const context = useOutletContext<IOutletProps>();

  const handleLogout = useCallback(async () => {
    context.supabase.auth.signOut();
  }, [context.supabase.auth]);

  return (
    <div>
      <h1>Account</h1>
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  );
}
