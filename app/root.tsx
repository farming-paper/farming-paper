import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import antdResetStyles from "antd/dist/reset.css";
import styles from "./styles/app.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: antdResetStyles },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Farming Paper",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="ko" className="bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative max-w-md min-h-[100vh] mx-auto bg-white">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
