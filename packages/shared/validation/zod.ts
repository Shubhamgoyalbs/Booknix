import {z} from "zod";

const authSignupSchema = z.object({
	email: z.email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string(),
	profilePicUrl: z.url()
})

const authSigninSchema = z.object({
	email: z.email(),
	password: z.string(),
})

const tokenSchema = z.object({
	token: z.string()
})

const otpVerifySchema = z.object({
	email: z
		.email("Please enter a valid email address")
		.trim()
		.min(1, "Email cannot be empty"),

	otp: z
		.string("OTP is required")
		.trim()
		.min(6, "OTP cannot be empty")
		.max(6, "OTP must of length 6"),

	issuedAt: z
		.number("issuedAt is required")
})

export {
	authSignupSchema,
	authSigninSchema,
	tokenSchema
}
