import { Resend } from "resend";
import {HTTPException} from "hono/http-exception";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendOtpEmail = async (to: string, otp: string) => {
	const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
      <tr>
        <td align="center" style="padding:40px 0;">
          
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width:500px;
              background:#ffffff;
              border-radius:8px;
              padding:30px;
            "
          >
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h1 style="margin:0; color:#111827;">Booknix</h1>
              </td>
            </tr>

            <tr>
              <td style="color:#374151; font-size:16px; line-height:24px;">
                <p>Hello 👋</p>
                <p>
                  Use the following One-Time Password (OTP) to verify your email address.
                  This code is valid for the next <strong>10 minutes</strong>.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:30px 0;">
                <div
                  style="
                    font-size:32px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#111827;
                    background:#f3f4f6;
                    padding:15px 25px;
                    border-radius:6px;
                    display:inline-block;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="color:#6b7280; font-size:14px; line-height:22px;">
                <p>If you didn’t request this, you can safely ignore this email.</p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="border-top:1px solid #e5e7eb; padding-top:20px; color:#9ca3af; font-size:12px;"
              >
                © ${new Date().getFullYear()} Booknix. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

	const { data, error } = await resend.emails.send({
		from: "Booknix <onboarding@resend.dev>",
		to,
		subject: "Your Booknix verification code",
		html,
	});

	if (error) {
		console.error("Failed to send OTP email:", error);
		throw new HTTPException(
			405,
			{
				cause: 'ServiceError',
				message: 'Error in sending mail, try again later!'
			}
		);
	}

	return data;
};
