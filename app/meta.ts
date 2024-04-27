import type { ServerRuntimeMetaDescriptor } from "@remix-run/server-runtime";

export const defaultMeta: ServerRuntimeMetaDescriptor[] = [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];
