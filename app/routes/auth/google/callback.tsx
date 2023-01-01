import type { LoaderArgs } from "@remix-run/server-runtime";
import { authenticator } from "~/auth/auth.server";

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
