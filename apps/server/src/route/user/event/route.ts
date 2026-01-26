import { Hono } from "hono";
import type { MiddlewareData } from "../../../../types/type.ts";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";
import eventTypeHandler from "../../../utils/handlers/eventTypeHandler.ts";

const eventRoute = new Hono<{
  Variables: MiddlewareData;
}>();

eventRoute.get("/", async (c) => {
  const events = await prismaClient.event.findMany({
    where: {
      eventStatus: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(
    {
      success: true,
      message: "Events fetched successfully.",
      events,
    },
    200,
  );
});

eventRoute.get("/:id", async (c) => {
  const eventId = c.req.param("id");

  const event = await prismaClient.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      organizer: true,
      ticketTypes: true,
      coupons: true,
      eventType: true,
    },
  });

  if (!event) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "Event wit this id doesn't exists",
    });
  }

  return c.json(
    {
      success: true,
      message: `Event with id:${eventId} fetched successfully.`,
      event,
    },
    200,
  );
});

eventRoute.all("/types", eventTypeHandler);

export default eventRoute;
