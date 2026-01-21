import { createMiddleware } from "hono/factory";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";
import type { MiddlewareData } from "../../types/type.ts";

const organizerAuthMiddleware = createMiddleware<{
  Variables: MiddlewareData;
}>(async (c, next) => {
  const userId = c.get("userId");

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      isOrganizer: true,
    },
  });

  if (!user || !user.isOrganizer) {
    throw new HTTPException(403, {
      message: "User does not have permission to access this resource",
      cause: "AuthMiddlewareError",
    });
  }

  await next();
});

export default organizerAuthMiddleware;
