import { useOutletContext } from "@remix-run/react";
// import { Button } from "flowbite-react";
import { Button } from "antd";
import { useEffect } from "react";
import type { IOutletProps } from "~/types";

// app/routes/login.tsx
export default function Login() {
  const props = useOutletContext<IOutletProps>();

  useEffect(() => {
    console.log("props", props);
  }, [props]);

  const handleGoogleLogin = async () => {
    const { error } = await props.supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error({ error });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-xl font-medium">로그인이 필요합니다.</h2>
      <Button onClick={handleGoogleLogin}>구글로 로그인</Button>
    </div>
  );
}
