import {hc} from "hono/client";
import type {AppType} from "@matty-stack/server/rpc";

const rawBaseUrl = import.meta.env.VITE_API_URL?.trim() ?? "";

const apiOrigin =
  rawBaseUrl && !rawBaseUrl.startsWith("http")
    ? `http://${rawBaseUrl}`
    : rawBaseUrl;

export const rpcClient = hc<AppType>(`${apiOrigin.replace(/\/$/, "")}/api`, {
  init: {
    credentials: "include",
  },
});
