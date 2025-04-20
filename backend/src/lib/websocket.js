export const connection = (socket) => {
	// Log tất cả event nhận được từ client
	const onevent = socket.onevent
	socket.onevent = function (packet) {
		const [eventName, ...args] = packet.data || []
		console.log(`[SOCKET] Event: ${eventName}`, ...args)
		onevent.call(this, packet)
	}

	// Event
	socket.on('subcribeRoom', (roomId) => {
		socket.join(roomId)
		console.log(`Socket ${socket.id} joined room: ${roomId}`)
	})
}
