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

export function getOxfordDictionaryApiCredentials() {
  const appId = process.env.OXFORD_DICTIONARY_APP_ID || "";
  const appKey = process.env.OXFORD_DICTIONARY_APP_KEY || "";
  const url = "https://od-api.oxforddictionaries.com/api/v2";

  return {
    appId,
    appKey,
    url,
  };
}

export function getPapagoApiCredentials() {
  const clientId = process.env.PAPAGO_CLIENT_ID || "";
  const clientSecret = process.env.PAPAGO_CLIENT_SECRET || "";
  return {
    clientId,
    clientSecret,
  };
}
