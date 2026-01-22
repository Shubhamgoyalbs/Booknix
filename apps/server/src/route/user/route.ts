import { Hono } from "hono";
import type { MiddlewareData } from "../../../types/type.ts";
import notificationRoute from "./notification/route.ts";
import eventRoute from "./event/route.ts";
import followRoute from "./follow/route.ts";

const userIndexRoute = new Hono<{
  Variables: MiddlewareData;
}>();

userIndexRoute.route("/notification", notificationRoute);
userIndexRoute.route("/event", eventRoute);
userIndexRoute.route("/follow", followRoute);

export default userIndexRoute;
