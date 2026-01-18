import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import authRoute from "./route/auth.route.ts";
import { HTTPException } from "hono/http-exception";
import otpRoute from "./route/otp.route.ts";
import "dotenv/config";
import organizerIndexRoute from "./route/organizer/index.route.ts";
import userIndexRoute from "./route/user/index.route.ts";
import userAuthMiddleware from "./middleware/user.middleware.ts";
import organizerAuthMiddleware from "./middleware/organizer.middleware.ts";

const app = new Hono().basePath("/api");

// Handlers
app.route("/auth", authRoute);
app.route("/otp", otpRoute);
app.route("/organizer", organizerIndexRoute);
app.route("/user", userIndexRoute);

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: {
          name: err.cause,
          message: err.message,
        },
      },
      err.status,
    );
  }

  console.error("Error: ", err);
  return c.json(
    {
      success: false,
      error: {
        name: "ServerError",
        message: "Internal Server Error",
      },
    },
    500,
  );
});

// Global Middlewares
app.use("*", logger());
app.use("*", prettyJSON());
// todo complete details for approved url
app.use("*", cors());
app.use("/api/user/*", userAuthMiddleware);
app.use("/api/organizer/*", userAuthMiddleware);
app.use("/api/organizer/*", organizerAuthMiddleware);

// Health Check
app.all("/health", (c) =>
  c.json({
    status: "ok",
    success: true,
    timestamp: new Date().toISOString(),
  }),
);

// 404 Handler
app.notFound((c) =>
  c.json(
    {
      error: "Not Found",
    },
    404,
  ),
);

const port = process.env.PORT || 3003;

export default {
  port,
  fetch: app.fetch,
};
