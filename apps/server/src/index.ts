import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import {Hono} from "hono";

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true,
}));

// Health Check
app.get('/health', (c) => c.json({
	status: 'ok',
	timestamp: new Date().toISOString()
}));

// Error Handler
app.onError(errorHandler);

// 404 Handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

const port = process.env.PORT || 3000;
console.log(`🚀 Server running on http://localhost:${port}`);

export default {
	port,
	fetch: app.fetch,
};
