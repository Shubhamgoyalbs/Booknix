import { Hono } from "hono";
import type { MiddlewareData } from "../../../../types/type.ts";
import { zValidator } from "@hono/zod-validator";
import { toggleSchema } from "@repo/shared/validation/zod.ts";
import prismaClient, { Prisma } from "@repo/db/client";
import { HTTPException } from "hono/http-exception";

const followRoute = new Hono<{
  Variables: MiddlewareData;
}>();

followRoute.post("/toggle", zValidator("json", toggleSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");

  const organizer = await prismaClient.user.findUnique({
    where: {
      id: body.id,
    },
  });

  if (organizer) {
    throw new HTTPException(400, {
      message: "InputError",
      cause: "Organizer with this id doesn't exists",
    });
  }

  if (body.toggle) {
    await prismaClient.follow.upsert({
      where: {
        organizerId_userId: {
          organizerId: body.id,
          userId,
        },
      },
      create: {
        organizer: {
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
        message: "User following the organizer successfully.",
      },
      201,
    );
  } else {
    try {
      await prismaClient.follow.delete({
        where: {
          organizerId_userId: {
            organizerId: body.id,
            userId,
          },
        },
      });

      return c.json(
        {
          success: true,
          message: "User unfollowed the organizer successfully.",
        },
        201,
      );
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          return c.json(
            {
              success: true,
              message: "User unfollowed the organizer successfully.",
            },
            201,
          );
        }
      }
      throw err;
    }
  }
});

followRoute.get("/", async (c) => {
  const userId = c.get("userId");

  const follows = await prismaClient.follow.findMany({
    where: {
      userId,
    },
    include: {
      organizer: true,
    },
  });

  return c.json(
    {
      success: true,
      message: "Follows fetched successfully.",
      follows,
    },
    200,
  );
});

export default followRoute;
