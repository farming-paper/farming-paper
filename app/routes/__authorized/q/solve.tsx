import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

export async function loader({ request }: LoaderArgs) {
  return json({ data: null, error: "" });
}

export default function Page() {
  return <></>;
}
