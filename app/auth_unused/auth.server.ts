// file: app/services/auth.server.js

import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { getGoogleClientId, getGoogleClientSecret, getHost } from "~/config";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { IProfile } from "~/types";
import { removeNullDeep } from "~/util";
import { sessionStorage } from "./session.server";

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: getGoogleClientId(),
    clientSecret: getGoogleClientSecret(),
    callbackURL: `${getHost()}/google/callback`,
  },
  async ({ accessToken, refreshToken, profile }): Promise<IProfile> => {
    // Get the user data from your DB or API using the tokens and profile
    // TODO: SQL 최적화 upsert 관련해서 한 번의 쿼리로 끝낼 수 있도록.
    const db = getServerSideSupabaseClient();
    const email = profile.emails[0].value;
    const photo = profile.photos[0].value;
    const existing = await db
      .from("accounts")
      .select("*")
      .eq("provider", "google")
      .eq("provider_id", profile.id);

    if (existing.data && existing.data.length > 0) {
      // update
      await db
        .from("accounts")
        .update({
          access_token: accessToken,
          updated_at: dayjs().toISOString(),
          email,
          photo,
          refresh_token: refreshToken,
        })
        .eq("provider", "google")
        .eq("provider_id", profile.id);
    } else {
      // insert
      await db.from("accounts").insert({
        access_token: accessToken,
        email,
        photo,
        provider: "google",
        provider_id: profile.id,
        refresh_token: refreshToken,
      });
    }

    // TODO: SQL 최적화
    const profileRes = await db
      .from("profiles")
      .select("email, id, photo, public_id")
      .eq("email", email);
    const found = profileRes.data?.[0];

    if (found) {
      return removeNullDeep(found);
    }

    const insertRes = await db
      .from("profiles")
      .insert({
        email,
        photo,
        public_id: nanoid(),
      })
      .select("email, id, photo, public_id")
      .single();
    if (insertRes.error) {
      throw new Error(insertRes.error.message);
    }

    return removeNullDeep(insertRes.data);
  }
);

authenticator.use(googleStrategy);
