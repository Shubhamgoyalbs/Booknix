import { z } from "zod";

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

  profilePicUrl: z.url("Please enter a valid URL").trim().or(z.literal("")),
});

const authSigninSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email cannot be empty"),

  password: z.string("Password is required").min(1, "Password cannot be empty"),
});

const tokenSchema = z.object({
  token: z.string("Token is required").trim().min(1, "Token cannot be empty"),
});

const otpGenerateSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email cannot be empty"),
});

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

  issuedAt: z.number("issuedAt is required"),
});

const ticketTypeSchema = z.object({
  typeName: z
    .string("Ticket type name is required")
    .trim()
    .min(1, "Ticket type name cannot be empty")
    .max(100, "Ticket type name must not exceed 100 characters"),

  total: z
    .number("Available tickets must be a number")
    .int("Available tickets must be an integer")
    .min(0, "Available tickets cannot be negative"),

  imageUrl: z.url("Please enter a valid image URL").trim(),

  price: z
    .number("Price must be a number")
    .min(0, "Price cannot be negative")
    .max(1000000, "Price must not exceed 1,000,000"),
});

const couponSchema = z.object({
  code: z
    .string("Coupon code is required")
    .trim()
    .min(1, "Coupon code cannot be empty")
    .max(50, "Coupon code must not exceed 50 characters")
    .toUpperCase(),

  description: z
    .string("Coupon description is required")
    .trim()
    .min(1, "Coupon description cannot be empty")
    .max(500, "Coupon description must not exceed 500 characters"),

  minPrice: z
    .number("Minimum price must be a number")
    .min(0, "Minimum price cannot be negative"),

  maxDiscount: z
    .number("Maximum discount must be a number")
    .min(0, "Maximum discount cannot be negative"),

  discountPercent: z
    .number("Discount percent must be a number")
    .min(0, "Discount percent cannot be less than 0")
    .max(100, "Discount percent cannot exceed 100"),
});

const eventCreateSchema = z.object({
  title: z
    .string("Event title is required")
    .trim()
    .min(1, "Event title cannot be empty")
    .min(3, "Event title must be at least 3 characters")
    .max(200, "Event title must not exceed 200 characters"),

  description: z
    .string("Event description is required")
    .trim()
    .min(1, "Event description cannot be empty")
    .min(10, "Event description must be at least 10 characters")
    .max(5000, "Event description must not exceed 5000 characters"),

  location: z
    .string("Event location is required")
    .trim()
    .min(1, "Event location cannot be empty")
    .max(500, "Event location must not exceed 500 characters"),

  dateTime: z
    .date("Event date and time is required")
    .refine((date) => date > new Date(), {
      message: "Event date must be in the future",
    }),

  duration: z
    .number("Duration must be a number")
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .max(10080, "Duration must not exceed 7 days (10080 minutes)"),

  eventTypeName: z
    .string("Please provide a valid event type Name")
    .min(1, "name must of min length 1"),

  imageUrl: z.url("Please enter a valid image URL").trim(),

  notificationMessage: z
    .string()
    .trim()
    .max(1000, "Notification message must not exceed 1000 characters"),

  ticketsType: z
    .array(ticketTypeSchema)
    .min(1, "At least one ticket type is required")
    .max(20, "Cannot have more than 20 ticket types"),

  coupons: z.array(couponSchema).max(15, "Cannot have more than 15 coupons"),
});

const eventBookingStatusSchema = z.object({
  status: z.enum(["STARTED", "CLOSED"]),

  eventId: z.cuid("eventId must be a valid cuid"),
});

const idSchema = z.object({
  id: z.cuid("ID must be a valid CUID"),
});

const eventDetailsSchema = z.object({
  id: z.cuid("Event ID must be a valid CUID"),

  title: z
    .string("Event title is required")
    .trim()
    .min(3, "Event title must be at least 3 characters")
    .max(200, "Event title must not exceed 200 characters"),

  description: z
    .string("Event description is required")
    .trim()
    .min(10, "Event description must be at least 10 characters")
    .max(5000, "Event description must not exceed 5000 characters"),

  imageUrl: z.url("Please enter a valid image URL").trim(),

  location: z
    .string("Event location is required")
    .trim()
    .min(1, "Event location cannot be empty")
    .max(500, "Event location must not exceed 500 characters"),

  dateTime: z
    .date("Event date and time is required")
    .refine((date) => date > new Date(), {
      message: "Event date must be in the future",
    }),

  duration: z
    .number("Duration must be a number")
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .max(10080, "Duration must not exceed 7 days (10080 minutes)"),
});

const couponUpdateSchema = z.object({
  id: z.cuid("Coupon ID must be a valid CUID"),

  code: z
    .string("Coupon code is required")
    .trim()
    .min(1, "Coupon code cannot be empty")
    .max(50, "Coupon code must not exceed 50 characters")
    .toUpperCase(),

  description: z
    .string("Coupon description is required")
    .trim()
    .min(1, "Coupon description cannot be empty")
    .max(500, "Coupon description must not exceed 500 characters"),

  minPrice: z
    .number("Minimum price must be a number")
    .min(0, "Minimum price cannot be negative"),

  maxDiscount: z
    .number("Maximum discount must be a number")
    .min(0, "Maximum discount cannot be negative"),

  discountPercent: z
    .number("Discount percent must be a number")
    .min(0, "Discount percent cannot be less than 0")
    .max(100, "Discount percent cannot exceed 100"),
});

const ticketTypeUpdateSchema = z.object({
  id: z.cuid("Ticket type ID must be a valid CUID"),

  total: z
    .number("Available tickets must be a number")
    .int("Available tickets must be an integer")
    .min(0, "Available tickets cannot be negative"),

  imageUrl: z.url("Please enter a valid image URL").trim(),

  price: z
    .number("Price must be a number")
    .min(0, "Price cannot be negative")
    .max(1000000, "Price must not exceed 1,000,000"),
});

export {
  authSignupSchema,
  authSigninSchema,
  tokenSchema,
  otpGenerateSchema,
  otpVerifySchema,
  ticketTypeSchema,
  couponSchema,
  eventCreateSchema,
  eventBookingStatusSchema,
  ticketTypeUpdateSchema,
  eventDetailsSchema,
  idSchema,
  couponUpdateSchema,
};
