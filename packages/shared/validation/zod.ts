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

export {
	authSignupSchema,
	authSigninSchema,
	tokenSchema
}
