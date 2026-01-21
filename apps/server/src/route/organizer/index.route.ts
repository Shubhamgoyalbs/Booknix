import { Hono } from "hono";
import eventRoute from "./event.route.ts";
import type { MiddlewareData } from "../../../types/type.ts";

const organizerIndexRoute = new Hono<{
  Variables: MiddlewareData;
}>();

organizerIndexRoute.route("/event", eventRoute);

//todo: routes: my details

export default organizerIndexRoute;
