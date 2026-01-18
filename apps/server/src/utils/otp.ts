import crypto from "crypto";

const OTP_SECRET =
  process.env.OTP_SECRET ||
  "babcf9a477168335bfeb07a37702a1e072297d2f2dbb0cf24df0bf9adcb393a6498a920942d76eb6";
const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS) || 600;

const generateOTP = (cuid: string, issuedAt: number | null) => {
  if (!issuedAt) {
    issuedAt = Math.floor(Date.now() / 1000); // unix seconds
  }

  const data = `otp:${cuid}:${issuedAt}`;

  const hmac = crypto.createHmac("sha256", OTP_SECRET).update(data).digest();

  // Take last 4 bytes → uint32 → 6 digits
  const code = hmac.readUInt32BE(hmac.length - 4) % 1_000_000;

  return {
    otp: code.toString().padStart(6, "0"),
    issuedAt,
  };
};

const verifyOTP = (cuid: string, otp: string, issuedAt: number) => {
  const now = Math.floor(Date.now() / 1000);

  // Expiry check
  if (now - issuedAt > OTP_TTL_SECONDS) {
    return false;
  }

  const expectedOtp = generateOTP(cuid, issuedAt);

  // Constant-time comparison
  return crypto.timingSafeEqual(Buffer.from(otp), Buffer.from(expectedOtp.otp));
};

export { generateOTP, verifyOTP };
