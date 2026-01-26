import { Hono } from "hono";
import type { MiddlewareData } from "../../../../../types/type.ts";
import prismaClient from "@repo/db/client";
import {zValidator} from "@hono/zod-validator";
import {idSchema} from "@repo/shared/validation/zod.ts";
import {HTTPException} from "hono/http-exception";
import {seatCountUpdateHandler} from "../../../../utils/webSocket.ts";

const eventBookingRoute = new Hono<{
  Variables: MiddlewareData;
}>();

eventBookingRoute.get('/', async (c) => {
	const userId = c.get('userId');

	const bookings = await prismaClient.booking.findMany({
		where: {
			userId
		},
		include: {
			bookingItems: true,
			coupon: true,
			event: {
				select: {
					id: true,
					title: true,
					imageUrl: true
				}
			}
		}
	})

	return c.json(
		{
			success: true,
			message: "Bookings fetched successfully.",
			bookings,
		},
		200,
	);
})

eventBookingRoute.post('/cancel', zValidator('json', idSchema), async (c) => {
	const userId = c.get('userId');
	const body = c.req.valid('json');
	const booking = await prismaClient.booking.findUnique({
		where: {
			userId,
			id: body.id
		}
	})

	if (!booking) {
		throw new HTTPException(404, {
			message: 'Booking not found' ,
			cause: 'InputError'
		})
	}

	if (booking.bookingStatus !== 'PENDING'){
		throw new HTTPException(404, {
			message: `Booking is already ${booking.bookingStatus}` ,
			cause: 'InputError'
		})
	}

	const bookingItems = await prismaClient.bookingItem.findMany({
		where: {
			bookingId: booking.id
		}
	})

	for (const item of bookingItems) {
		await prismaClient.ticketType.update({
			where: {
				id: item.ticketTypeId
			},
			data: {
				available: {
					increment: item.quantity
				},
				locked: {
					decrement: item.quantity
				}
			}
		})
	}

	await prismaClient.ticketLock.deleteMany({
		where: {
			userId,
			bookingId: booking.id
		}
	})

	await prismaClient.booking.update({
		where: {
			id: booking.id
		},
		data: {
			bookingStatus: "CANCELED"
		}
	})

	seatCountUpdateHandler(booking.eventId);

	return c.json(
		{
			success: true,
			message: "Booking canceled successfully."
		},
		201,
	);
})
//pay
//create booking

export default eventBookingRoute;
