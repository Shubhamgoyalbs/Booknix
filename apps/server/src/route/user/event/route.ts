import { Hono } from "hono";
import type { MiddlewareData } from "../../../../types/type.ts";

const eventRoute = new Hono<{
  Variables: MiddlewareData;
}>();



export default eventRoute;
