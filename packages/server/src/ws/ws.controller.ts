import {createBunWebSocket} from "hono/bun";
import type {WSMessageReceive} from "hono/ws";
import {createRouter} from "../common/hono";

const {upgradeWebSocket, websocket} = createBunWebSocket();

const toText = (message: WSMessageReceive) => {
  if (typeof message === "string") {
    return message;
  }

  return "binary";
};

export const wsController = createRouter().get(
  "/",
  upgradeWebSocket(() => ({
    onOpen: (_event, ws) => {
      ws.send(
        JSON.stringify({
          type: "socket.ready",
          payload: {message: "Connected to matty-stack"},
        }),
      );
    },
    onMessage: (event, ws) => {
      const message = toText(event.data);

      ws.send(
        JSON.stringify({
          type: "socket.echo",
          payload: {message},
        }),
      );
    },
  })),
);

export {websocket};
