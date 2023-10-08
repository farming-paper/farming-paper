/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  publicPath: "/build/",
  serverMainFields: ["main", "module"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ["nanoid", "marked"],
  tailwind: true,
  postcss: true,
  cacheDirectory: "./node_modules/.cache/remix",
};
