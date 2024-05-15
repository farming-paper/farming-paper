import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader";

export { loader } from "./loader";

export const meta: MetaFunction = () => {
  return [{ title: "Process | Farming Paper" }];
};

export default function Process() {
  const { success, data } = useLoaderData<typeof loader>();
  return (
    <div>
      {success ? "success!" : "failed!"}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
