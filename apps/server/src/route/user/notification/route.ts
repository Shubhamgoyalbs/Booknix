import { Hono } from "hono";
import type { MiddlewareData } from "../../../../types/type";
import prismaClient from "@repo/db/client";

const notificationRoute = new Hono<{
	Variables: MiddlewareData;
}>();

notificationRoute.get("/", async (c) => {
	const userId = c.get("userId");

	const notifications = await prismaClient.notification.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 150,
	});

	return c.json(
		{
			success: true,
			message: "Notifications fetched successfully",
			data: notifications,
		},
		200
	);
});

notificationRoute.post("/seen", async (c) => {
	const userId = c.get("userId");

	await prismaClient.notification.updateMany({
		where: {
			userId,
			seen: false,
		},
		data: {
			seen: true,
		},
	});

	return c.json(
		{
			success: true,
			message: "All notifications marked as seen",
		},
		200
	);
});

export default notificationRoute;
