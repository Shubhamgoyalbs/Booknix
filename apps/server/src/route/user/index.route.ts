import { Hono } from "hono";
import type { MiddlewareData } from "../../../types/type.ts";

const userIndexRoute = new Hono<{
  Variables: MiddlewareData;
}>();

export default userIndexRoute;
