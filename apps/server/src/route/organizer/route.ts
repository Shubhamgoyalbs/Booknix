import { Hono } from "hono";
import route from "./event/route.ts";
import type { MiddlewareData } from "../../../types/type.ts";

const organizerIndexRoute = new Hono<{
  Variables: MiddlewareData;
}>();

organizerIndexRoute.route("/event", route);

//todo: routes: my details

export default organizerIndexRoute;
