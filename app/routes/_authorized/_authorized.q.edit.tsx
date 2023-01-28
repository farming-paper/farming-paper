import { redirect } from "@remix-run/server-runtime";

export async function loader() {
  return redirect("/q/list/1");
}
