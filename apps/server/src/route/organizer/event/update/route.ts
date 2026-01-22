import { Hono } from "hono";
import type { MiddlewareData } from "../../../../../types/type.ts";
import { zValidator } from "@hono/zod-validator";
import {
  couponUpdateSchema,
  eventDetailsSchema,
  idSchema,
  ticketTypeUpdateSchema,
} from "@repo/shared/validation/zod.ts";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";

const route = new Hono<{
  Variables: MiddlewareData;
}>();

route.put("/details", zValidator("json", eventDetailsSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");

  const event = await prismaClient.event.findUnique({
    where: {
      id: body.id,
      organizerId: userId,
    },
    select: {
      id: true,
      eventBookingStatus: true,
    },
  });

  if (!event) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "Event with this id doesn't exist.",
    });
  }

  if (event.eventBookingStatus !== "WAITING") {
    throw new HTTPException(400, {
      cause: "InvalidOperation",
      message:
        "Event details can only be modified when event booking status is WAITING.",
    });
  }

  await prismaClient.event.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      location: body.location,
      dateTime: body.dateTime,
      duration: body.duration,
    },
  });

  return c.json({
    success: true,
    message: "Event details updated successfully.",
  });
});

route.put("/coupon", zValidator("json", couponUpdateSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");

  const coupon = await prismaClient.coupon.findUnique({
    where: {
      id: body.id,
    },
    include: {
      event: {
        select: {
          eventBookingStatus: true,
          organizerId: true,
        },
      },
    },
  });

  if (!coupon) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "Coupon with this id doesn't exist.",
    });
  }

  if (
    coupon.event.eventBookingStatus !== "WAITING" ||
    coupon.event.organizerId !== userId
  ) {
    throw new HTTPException(400, {
      cause: "InvalidOperation",
      message:
        "Coupons can only be modified by organizer when event booking status is WAITING.",
    });
  }

  await prismaClient.coupon.update({
    where: {
      id: body.id,
    },
    data: {
      code: body.code,
      description: body.description,
      minPrice: body.minPrice,
      maxDiscount: body.maxDiscount,
      discountPercent: body.discountPercent,
    },
  });

  return c.json({
    success: true,
    message: "Coupon updated successfully.",
  });
});

route.delete("/coupon", zValidator("json", idSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");

  const coupon = await prismaClient.coupon.findUnique({
    where: {
      id: body.id,
    },
    include: {
      event: {
        select: {
          eventBookingStatus: true,
          organizerId: true,
        },
      },
    },
  });

  if (!coupon) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "Coupon with this id doesn't exist.",
    });
  }

  if (
    coupon.event.eventBookingStatus !== "WAITING" ||
    coupon.event.organizerId !== userId
  ) {
    throw new HTTPException(400, {
      cause: "InvalidOperation",
      message:
        "Coupons can only be deleted by organizer when event booking status is WAITING.",
    });
  }

  await prismaClient.coupon.delete({
    where: {
      id: body.id,
    },
  });

  return c.json({
    success: true,
    message: "Coupon deleted successfully.",
  });
});

route.put(
  "/ticket-type",
  zValidator("json", ticketTypeUpdateSchema),
  async (c) => {
    const body = c.req.valid("json");
    const userId = c.get("userId");

    const ticketType = await prismaClient.ticketType.findUnique({
      where: {
        id: body.id,
      },
      include: {
        event: {
          select: {
            eventBookingStatus: true,
            organizerId: true,
          },
        },
      },
    });

    if (!ticketType) {
      throw new HTTPException(400, {
        cause: "InputError",
        message: "Ticket type with this id doesn't exist.",
      });
    }

    if (
      ticketType.event.eventBookingStatus !== "WAITING" ||
      ticketType.event.organizerId !== userId
    ) {
      throw new HTTPException(400, {
        cause: "InvalidOperation",
        message:
          "Ticket types can only be modified by organizer when event booking status is WAITING.",
      });
    }

    await prismaClient.ticketType.update({
      where: {
        id: body.id,
      },
      data: {
        total: body.total,
        imageUrl: body.imageUrl,
        price: body.price,
      },
    });

    return c.json({
      success: true,
      message: "Ticket type updated successfully.",
    });
  },
);

route.delete("/ticket-type", zValidator("json", idSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");

  const ticketType = await prismaClient.ticketType.findUnique({
    where: {
      id: body.id,
    },
    include: {
      event: {
        select: {
          eventBookingStatus: true,
          organizerId: true,
        },
      },
    },
  });

  if (!ticketType) {
    throw new HTTPException(400, {
      cause: "InputError",
      message: "Ticket type with this id doesn't exist.",
    });
  }

  if (
    ticketType.event.eventBookingStatus !== "WAITING" ||
    ticketType.event.organizerId !== userId
  ) {
    throw new HTTPException(400, {
      cause: "InvalidOperation",
      message:
        "Ticket types can only be deleted by organizer when event booking status is WAITING.",
    });
  }

  await prismaClient.ticketType.delete({
    where: {
      id: body.id,
    },
  });

  return c.json({
    success: true,
    message: "Ticket type deleted successfully.",
  });
});

export default route;
