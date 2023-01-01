import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";
import type { Database } from "~/supabase/generated/supabase-types";

export default function Login({
  supabase,
  session,
}: {
  supabase: SupabaseClient<Database>;
  session: Session | null;
}) {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error({ error });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // eslint-disable-next-line no-console
      console.error({ error });
    }
  };

  return session ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <>
      <button onClick={handleGoogleLogin}>구글 로그인</button>
    </>
  );
}
