import {API_BASE_URL} from "../../lib/rpc.client";

export const createWebSocketUrl = (path = "/ws") => {
  const url = new URL(
    path,
    API_BASE_URL.startsWith("/") ? window.location.origin : API_BASE_URL,
  );

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

  return url.toString();
};
