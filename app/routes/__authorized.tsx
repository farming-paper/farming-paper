import {
  Outlet,
  useCatch,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { message } from "antd";
import { useEffect } from "react";
import { getSessionWithProfile } from "~/auth/get-session";
import BottomNav from "~/common/components/BottomNav";
import type { IOutletProps } from "~/types";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const { profile, session, supabaseClient } = await getSessionWithProfile({
    request,
    response,
  });

  if (!session || !profile) {
    supabaseClient.auth.signOut();
    return redirect("/login", {
      headers: response.headers,
    });
  }

  return json({
    profile,
  });
};

const Authorized = () => {
  // const data = useLoaderData<typeof loader>();
  // const messaged = useRef(false);
  const context = useOutletContext<IOutletProps>();
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get("status");
    if (status === "already_logged_in") {
      message.info("이미 로그인되어 있습니다.");
    }
  }, [params]);

  return (
    <>
      <Outlet context={context} />
      <BottomNav />
    </>
  );
};

export function CatchBoundary() {
  const caught = useCatch();
  const context = useOutletContext<IOutletProps>();
  const navigate = useNavigate();

  useEffect(() => {
    if (caught.status === 401) {
      context.supabase.auth.signOut();
      navigate("/login", { replace: true });
    }
  }, [caught.status, context.supabase.auth, navigate]);

  return (
    <div>
      <h1>로그인 정보가 없습니다. 로그인 페이지로 이동합니다.</h1>
    </div>
  );
}

export default Authorized;
