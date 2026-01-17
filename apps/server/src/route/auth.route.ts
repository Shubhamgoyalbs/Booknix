import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {authSigninSchema, authSignupSchema, tokenSchema} from '@repo/shared/validation/zod.ts'
import prismaClient from '@repo/db/client'
import { HTTPException } from 'hono/http-exception'
import * as bcrypt from 'bcrypt'
import {generateTokens, verifyRefreshToken} from "../utils/jwt.ts";

const authRoute = new Hono()

// POST /signup
authRoute.post(
	'/signup',
	zValidator('json', authSignupSchema),
	async (c) => {
		const body = c.req.valid('json')

		const existingUser = await prismaClient.user.findUnique({
			where: { email: body.email },
		})

		if (existingUser) {
			throw new HTTPException(400, {
				message: 'Email already in use.',
				cause: 'InputError',
			})
		}

		const hashedPassword = await bcrypt.hash(body.password, 12)

		await prismaClient.user.create({
			data: {
				...body
			},
		})

		return c.json(
			{
				success: true,
				message: 'Signed up successfully.',
			},
			201
		)
	}
)

// POST /signin
authRoute.post(
	'/signin',
	zValidator('json', authSigninSchema),
	async (c) => {
		const body = c.req.valid('json')

		const user = await prismaClient.user.findUnique({
			where: { email: body.email },
			select: {
				id: true,
				email: true,
				password: true,
				verified: true,
			},
		})

		if (!user) {
			throw new HTTPException(401, {
				message: "Credentials doesn't exists.",
				cause: 'InputError',
			})
		}

		if (!user.verified) {
			throw new HTTPException(403, {
				message: 'Email not verified.',
				cause: 'OtpError',
			})
		}

		const isValidPassword = await bcrypt.compare(
			body.password,
			user.password
		)

		if (!isValidPassword) {
			throw new HTTPException(401, {
				message: 'Invalid password.',
			})
		}

		const data = generateTokens({
			userId: user.id,
			email: user.email
		})

		await prismaClient.user.update({
			where: {
				id: user.id
			},
			data: {
				refreshToken: data.refreshToken
			}
		})

		return c.json(
			{
				success: true,
				message: 'Signed in successfully.',
				data
			},
			200
		)
	}
)

authRoute.post(
	'/refresh/token',
	zValidator('json', tokenSchema),
	async (c) => {
		const body = c.req.valid('json');
		const user = await prismaClient.user.findUnique({
			where: {
				refreshToken: body.token
			}
		})

		if (!user){
			throw new HTTPException(400,
				{
					cause: "InputError",
					message: "Refresh token is not longer valid"
				}
			)
		}

		const result = verifyRefreshToken(body.token);

		if (!result) {
			throw new HTTPException(400,
				{
					cause: "InputError",
					message: "Refresh token is not longer valid"
				}
			)
		}

		const data = generateTokens(result);

		await prismaClient.user.update({
			where: {
				id: result.userId
			},
			data: {
				refreshToken: data.refreshToken
			}
		})

		return c.json(
			{
				success: true,
				message: 'Token refreshed successfully.',
				data
			},
			200
		)
	}
)

export default authRoute
