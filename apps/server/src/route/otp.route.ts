import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  otpGenerateSchema,
  otpVerifySchema,
} from "@repo/shared/validation/zod.ts";
import { HTTPException } from "hono/http-exception";
import { generateOTP, verifyOTP } from "../utils/otp.ts";
import { getUserIdHelper } from "../utils/helper.ts";
import type { MiddlewareData } from "../../types/type.ts";

const otpRoute = new Hono<{
  Variables: MiddlewareData;
}>();

otpRoute.post("/generate", zValidator("json", otpGenerateSchema), async (c) => {
  const body = c.req.valid("json");

  const userId = await getUserIdHelper(body.email);

  const data = generateOTP(userId, null);

  //todo email send

  return c.json(
    {
      success: true,
      message: "Otp sent successfully.",
      issuedAt: data.issuedAt,
    },
    200,
  );
});

otpRoute.post("/verify", zValidator("json", otpVerifySchema), async (c) => {
  const body = c.req.valid("json");

  const userId = await getUserIdHelper(body.email);

  const result = verifyOTP(userId, body.otp, body.issuedAt);

  if (!result) {
    throw new HTTPException();
  }

  return c.json(
    {
      success: true,
      message: "Otp verified successfully.",
    },
    200,
  );
});

export default otpRoute;
