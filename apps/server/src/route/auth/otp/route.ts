import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  otpGenerateSchema,
  otpVerifySchema,
} from "@repo/shared/validation/zod.ts";
import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";
import { generateOTP, verifyOTP } from "../../../utils/otp.ts";
import { getUserIdHelper } from "../../../utils/helper.ts";
import type { MiddlewareData } from "../../../../types/type.ts";
import {sendOtpEmail} from "../../../utils/mailService.ts";

const otpAuthRoute = new Hono<{
  Variables: MiddlewareData;
}>();

otpAuthRoute.post("/generate", zValidator("json", otpGenerateSchema), async (c) => {
  const body = c.req.valid("json");

  const userId = await getUserIdHelper(body.email);

  const data = generateOTP(userId, null);

  await sendOtpEmail(body.email, data.otp)

  return c.json(
    {
      success: true,
      message: "Otp sent successfully.",
      issuedAt: data.issuedAt,
    },
    200,
  );
});

otpAuthRoute.post("/verify", zValidator("json", otpVerifySchema), async (c) => {
  const body = c.req.valid("json");

  const userId = await getUserIdHelper(body.email);

  const result = verifyOTP(userId, body.otp, body.issuedAt);

  if (!result) {
    throw new HTTPException(
			400,
	    {
				cause: 'OtpError',
		    message: 'Invalid otp, try again!'
	    }
    );
  }

  await prismaClient.user.update({
    where: { email: body.email },
    data: { verified: true },
  });

  return c.json(
    {
      success: true,
      message: "Otp verified successfully.",
    },
    200,
  );
});

export default otpAuthRoute;
