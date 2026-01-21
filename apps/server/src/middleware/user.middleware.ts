import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verifyAccessToken } from "../utils/jwt.ts";
import type { MiddlewareData } from "../../types/type.ts";

const userAuthMiddleware = createMiddleware<{
  Variables: MiddlewareData;
}>(async (c, next) => {
  const header = c.req.header("Authorization");

  // Missing or malformed Authorization header
  if (!header || !header.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Authorization token is missing or malformed",
      cause: "AuthMiddlewareError",
    });
  }

  const token = header.substring(7);

  const result = verifyAccessToken(token);

  // Invalid / expired token
  if (!result) {
    throw new HTTPException(401, {
      message: "Invalid or expired access token",
      cause: "AuthMiddlewareError",
    });
  }

  // Attach user info to context
  c.set("userId", result.userId);
  c.set("email", result.email);

  await next();
});

export default userAuthMiddleware;
