import {Hono} from "hono";

const api = new Hono();

export type ApiType = typeof api;
export default api;
