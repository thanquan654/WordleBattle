import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import connectDB from './lib/database.js'
import appRouter from './routers/app.router.js'
import { connection as WebSocketConnection } from './lib/websocket.js'
import { makeWordList } from './helpers/game.js'

dotenv.config() // Load biến môi trường

const app = express()
app.use(express.json())
app.use(
	cors({
		origin: '*',
	}),
)
app.use(morgan('tiny'))

const port = process.env.PORT || 3001

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*',
	},
})
global.__io = io

const main = async () => {
	try {
		await makeWordList()

		await connectDB()

		app.use('/api', appRouter)

		app.get('/health', (req, res) => {
			res.send('Hello World!')
		})

		global.__io.on('connection', WebSocketConnection)

		server.listen(port, () => {
			console.log(`🚀 Server running on http://localhost:${port}`)
		})
	} catch (error) {
		console.error('❌ Error when start server:', error)
		process.exit(1)
	}
}

main()
