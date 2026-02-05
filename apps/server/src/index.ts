import { Hono } from 'hono'
import api from "@repo/hono-api";

const app = new Hono()

app.route('/api', api)

export default {
	port: 3000,
	fetch: app.fetch
}
