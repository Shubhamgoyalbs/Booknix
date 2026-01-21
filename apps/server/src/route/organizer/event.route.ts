import { Hono } from "hono";
import type { MiddlewareData } from "../../../types/type.ts";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  eventBookingStatusSchema,
  eventCreateSchema,
} from "@repo/shared/validation/zod.ts";
import { NotificationHandler } from "../../utils/webSocket.ts";
import eventTypeHandler from "../../utils/handlers/eventTypeHandler.ts";
import eventUpdateRoute from "./event.update.route.ts";

const eventRoute = new Hono<{
  Variables: MiddlewareData;
}>();

eventRoute.route("/update", eventUpdateRoute);

eventRoute.all("/types", eventTypeHandler);

eventRoute.get("/my", async (c) => {
  const userId = c.get("userId");

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      organizer: true,
      events: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          location: true,
          dateTime: true,
          eventBookingStatus: true,
          eventStatus: true,
          eventType: true,
        },
      },
    },
  });

  if (!user) {
    throw new HTTPException(404, {
      message: "User not found",
      cause: "UserNotFound",
    });
  }

  return c.json(
    {
      success: true,
      message: "",
      events: user.events,
    },
    200,
  );
});

eventRoute.post("/create", zValidator("json", eventCreateSchema), async (c) => {
  const userId = c.get("userId");

  const body = c.req.valid("json");

  const eventType = await prismaClient.eventType.upsert({
    where: {
      typeName: body.eventTypeName,
    },
    create: {
      typeName: body.eventTypeName,
    },
    update: {},
  });

  const event = await prismaClient.event.create({
    data: {
      title: body.title,
      description: body.description,
      dateTime: body.dateTime,
      location: body.location,
      imageUrl: body.imageUrl,
      duration: body.duration,
      eventType: {
        connect: {
          id: eventType.id,
        },
      },
      organizer: {
        connect: {
          id: userId,
        },
      },
    },
  });

  await prismaClient.ticketType.createMany({
    data: body.ticketsType.map((ticket) => ({
      typeName: ticket.typeName,
      total: ticket.total,
      available: ticket.total,
      imageUrl: ticket.imageUrl,
      locked: 0,
      price: ticket.price,
      eventId: event.id,
    })),
    skipDuplicates: true,
  });

  await prismaClient.coupon.createMany({
    data: body.coupons.map((coupon) => ({
      code: coupon.code,
      description: coupon.description,
      minPrice: coupon.minPrice,
      maxDiscount: coupon.maxDiscount,
      discountPercent: coupon.discountPercent,
      eventId: event.id,
    })),
    skipDuplicates: true,
  });

  if (body.notificationMessage) {
    const userIdList = await prismaClient.follow.findMany({
      where: {
        organizerId: userId,
      },
      select: {
        userId: true,
      },
    });

    await prismaClient.notification.createMany({
      data: userIdList.map(({ userId }) => ({
        userId,
        message: body.notificationMessage,
      })),
      skipDuplicates: true,
    });

    NotificationHandler(userIdList);
  }

  return c.json(
    {
      success: true,
      message: "Event created successfully.",
      event: {
        id: event.id,
      },
    },
    201,
  );
});

eventRoute.get("/:id", async (c) => {
  const eventId = c.req.param("id");

  const event = await prismaClient.event.findUnique({
    where: { id: eventId },
    include: {
      coupons: true,
      ticketTypes: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!event) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "event with this id doesn't exists.",
    });
  }

  return c.json(
    {
      success: true,
      message: "Event fetched successfully.",
      event,
    },
    200,
  );
});

eventRoute.put(
  "/booking-status",
  zValidator("json", eventBookingStatusSchema),
  async (c) => {
    const body = c.req.valid("json");

    const event = await prismaClient.event.findUnique({
      where: {
        id: body.eventId,
      },
      select: {
        eventBookingStatus: true,
      },
    });

    if (!event) {
      throw new HTTPException(400, {
        cause: "InputError",
        message: "Event with this id doesn't exist.",
      });
    }

    if (body.status === "STARTED") {
      if (event.eventBookingStatus !== "WAITING") {
        throw new HTTPException(400, {
          cause: "InvalidStatusTransition",
          message: "Event booking can only be started when status is WAITING.",
        });
      }

      await prismaClient.event.update({
        where: {
          id: body.eventId,
        },
        data: {
          eventBookingStatus: "STARTED",
        },
      });

      return c.json({
        success: true,
        message: "Event booking status updated to STARTED.",
      });
    } else if (body.status === "CLOSED") {
      if (event.eventBookingStatus !== "STARTED") {
        throw new HTTPException(400, {
          cause: "InvalidStatusTransition",
          message: "Event booking can only be closed when status is STARTED.",
        });
      }

      await prismaClient.event.update({
        where: {
          id: body.eventId,
        },
        data: {
          eventBookingStatus: "CLOSED",
        },
      });

      return c.json({
        success: true,
        message: "Event booking status updated to CLOSED.",
      });
    } else {
      throw new HTTPException(400, {
        cause: "InvalidStatus",
        message:
          "Invalid status provided. Allowed values are STARTED or CLOSED.",
      });
    }
  },
);

eventRoute.get("booking/:id", async (c) => {
  const eventId = c.req.param("id");

  const event = await prismaClient.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      bookings: true,
    },
  });

  if (!event) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "event with this id doesn't exists.",
    });
  }

  return c.json(
    {
      success: true,
      message: "Event bookings fetched successfully.",
      bookings: event.bookings,
    },
    200,
  );
});

//todo jobs: make event closed after event complete, make booking status(optional), ticket lock,booking check

export default eventRoute;
