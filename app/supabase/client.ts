import { createClient } from "@supabase/supabase-js";

import { getServerSideSupabaseConfig } from "~/config";

import type { Database } from "./generated/supabase-types";

let serviceClient: ReturnType<typeof createClient<Database>> | null = null;

export function getServerSideSupabaseClient() {
  const { url, serviceRoleKey } = getServerSideSupabaseConfig();
  if (!serviceClient) {
    serviceClient = createClient<Database>(url, serviceRoleKey);
  }

  return serviceClient;
}
