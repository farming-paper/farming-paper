import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { getServerSideSupabaseClient } from "./client";
import type { Database } from "./generated/supabase-types";

export async function rpc<Func extends keyof Database["public"]["Functions"]>(
  f: Func,
  args: Database["public"]["Functions"][Func]["Args"]
): Promise<
  PostgrestSingleResponse<Database["public"]["Functions"][Func]["Returns"]>
> {
  const db = getServerSideSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.rpc(f, args) as any;
}
