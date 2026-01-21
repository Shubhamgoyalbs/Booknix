import type { Context } from "hono";
import prismaClient from "@repo/db/client";

const eventTypeHandler = async (c: Context) => {
  const eventTypes = await prismaClient.eventType.findMany({
    select: {
      typeName: true,
    },
  });

  return c.json(
    {
      success: true,
      message: "EventTypes fetched successfully.",
      eventTypes,
    },
    200,
  );
};

export default eventTypeHandler;
