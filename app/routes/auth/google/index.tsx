// app/routes/auth/google.tsx
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";

export const loader = () => redirect("/login");

export const action = ({ request }: ActionArgs) => {
  return authenticator.authenticate("google", request);
};
