import { Hono } from "hono";
import type { MiddlewareData } from "../../../../../types/type.ts";
import { zValidator } from "@hono/zod-validator";
import { toggleSchema } from "@repo/shared/validation/zod.ts";
import prismaClient, { Prisma } from "@repo/db/client";
import { HTTPException } from "hono/http-exception";

const eventSubscribeRoute = new Hono<{
  Variables: MiddlewareData;
}>();

eventSubscribeRoute.post(
  "toggle",
  zValidator("json", toggleSchema),
  async (c) => {
    const body = c.req.valid("json");
    const userId = c.get("userId");

    const event = await prismaClient.event.findUnique({
      where: {
        id: body.id,
      },
    });

    if (event) {
      throw new HTTPException(400, {
        message: "InputError",
        cause: "Event with this id doesn't exists",
      });
    }

    if (body.toggle) {
      await prismaClient.subscribe.upsert({
        where: {
          userId_eventId: {
            eventId: body.id,
            userId,
          },
        },
        create: {
          event: {
            connect: {
              id: body.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: {},
      });

      return c.json(
        {
          success: true,
          message: "User subscribed the event successfully.",
        },
        201,
      );
    } else {
      try {
        await prismaClient.subscribe.delete({
          where: {
            userId_eventId: {
              eventId: body.id,
              userId,
            },
          },
        });

        return c.json(
          {
            success: true,
            message: "User unsubscribed the event successfully.",
          },
          201,
        );
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2025") {
            return c.json(
              {
                success: true,
                message: "User unsubscribed the event successfully.",
              },
              201,
            );
          }
        }
        throw err;
      }
    }
  },
);

eventSubscribeRoute.get("/", async (c) => {
  const userId = c.get("userId");

  const subscriptions = await prismaClient.subscribe.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
    },
  });

  return c.json(
    {
      success: true,
      message: "Follows fetched successfully.",
      subscriptions,
    },
    200,
  );
});

export default eventSubscribeRoute;
