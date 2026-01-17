import {z} from "zod";

const authSignupSchema = z.object({
	email: z
		.email("Please enter a valid email address")
		.trim()
		.min(1, "Email cannot be empty"),

	firstName: z
		.string("First name is required")
		.trim()
		.min(1, "First name cannot be empty")
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name must not exceed 50 characters"),

	lastName: z
		.string("Last name is required")
		.trim()
		.min(1, "Last name cannot be empty")
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name must not exceed 50 characters"),

	password: z
		.string("Password is required")
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password must not exceed 128 characters"),
	// Add regex here for password strength requirements

	profilePicUrl: z
		.url("Please enter a valid URL")
		.trim()
		.or(z.literal(""))
});

const authSigninSchema = z.object({
	email: z
		.email("Please enter a valid email address")
		.trim()
		.min(1, "Email cannot be empty"),

	password: z
		.string("Password is required")
		.min(1, "Password cannot be empty")
});

const tokenSchema = z.object({
	token: z
		.string("Token is required")
		.trim()
		.min(1, "Token cannot be empty")
});

const otpGenerateSchema = z.object({
	email: z
		.email("Please enter a valid email address")
		.trim()
		.min(1, "Email cannot be empty"),
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
	tokenSchema,
	otpGenerateSchema,
	otpVerifySchema
};
