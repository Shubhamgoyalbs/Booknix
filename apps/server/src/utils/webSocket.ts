import { Hono } from "hono";
import type { MiddlewareData } from "../../types/type.ts";
import { upgradeWebSocket } from "hono/bun";
import { verifyAccessToken } from "./jwt.ts";
import type { WSContext } from "hono/ws";
import type { wsResponse } from "@repo/shared/index.ts";

const webSocket = new Hono<{
  Variables: MiddlewareData;
}>();

const users = new Map<string, WSContext>();
webSocket.get(
  "/",
  upgradeWebSocket((c) => {
    const token = c.req.query("token");
    const data = verifyAccessToken(token || "");

    if (!data) {
      return {
        onOpen(event, ws) {
          ws.close(401, "Unauthorized");
        },
      };
    }

    const userId = data.userId;

    return {
      onOpen(event, ws) {
        console.log(`WEB_SOCKET - User with id ${userId} connected`);
        users.set(userId, ws);
      },
      onClose() {
        console.log(`WEB_SOCKET - User with id ${userId} disconnected`);
        users.delete(userId);
      },
    };
  }),
);

export const NotificationHandler = (list: { userId: string }[]) => {
  for (const userFromList of list) {
    const user = users.get(userFromList.userId);
    if (!user) {
      continue;
    }

    const message: wsResponse = {
      type: "NOTIFICATION",
      message: "You got notification",
    };

    user.send(JSON.stringify(message));
  }
};

export default webSocket;
