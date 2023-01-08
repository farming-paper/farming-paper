export function getServerSideSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase config");
  }
  return {
    url,
    serviceRoleKey,
  };
}

export function getClientSideSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase config");
  }
  return {
    url,
    anonKey,
  };
}

export const defaultDateFormat = "YYYY-MM-DD";

export function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
}
export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || "";
}
