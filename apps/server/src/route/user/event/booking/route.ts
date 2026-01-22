import { Hono } from "hono";
import type { MiddlewareData } from "../../../../../types/type.ts";

const eventBookingRoute = new Hono<{
  Variables: MiddlewareData;
}>();

export default eventBookingRoute;
