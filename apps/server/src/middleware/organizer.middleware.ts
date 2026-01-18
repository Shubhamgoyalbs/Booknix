import { createMiddleware } from "hono/factory";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";

const organizerAuthMiddleware = createMiddleware(async (c, next) => {
  const userId: string = c.get("userID");

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
