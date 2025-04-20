import { randomChars, getRandomAvatar } from '../helpers/room.js'
import Room from '../schemas/Room.schema.js'

const getARoomInfo = async (req, res) => {
	const roomId = req.params.roomId

	try {
		const room = await Room.findOne({ roomId: roomId }).where({
			gameState: 'waiting',
		})

		if (!room) {
			res.status(404).json({ message: 'Không tìm thấy phòng' })
			return
		}

		res.status(200).json(room)
	} catch (err) {
		console.error(err)
		res.status(500).json(err)
	}
}

const createRoom = async (req, res) => {
	try {
		// {id, name}
		const createRoomPlayer = req.body

		// Logic: Room code is 8 characters long
		let isValidRoomCode = false
		let roomCode = randomChars(4)

		while (!isValidRoomCode) {
			const room = await Room.findOne({ roomId: roomCode })
			if (room) {
				roomCode = randomChars(4)
			} else {
				isValidRoomCode = true
			}
		}

		const newRoom = await new Room({
			roomId: roomCode,
			players: [
				{
					playerId: createRoomPlayer.id,
					playerName: createRoomPlayer.name,
					avatar: getRandomAvatar(),
					state: 'owner',
				},
			],
		})

		const result = await newRoom.save()

		res.status(200).json(result)
	} catch (err) {
		console.error(err)
		res.status(500).json(err)
	}
}

const joinARoom = async (req, res) => {
	try {
		// {id, name, isBot}
		const joinRoomPlayer = req.body
		const roomId = req.params.roomId

		const room = await Room.findOne({ roomId: roomId })

		if (!room) {
			res.status(404).json({ message: 'Không tìm thấy phòng' })
			return
		}

		if (
			room.players.find((player) => player.playerId === joinRoomPlayer.id)
		) {
			res.status(409).json({ message: 'Nguoi choi nay da choi' })
			return
		}

		if (room.players.length >= 20) {
			res.status(409).json({ message: 'Phong da day' })
			return
		}

		const newPlayer = {
			playerId: joinRoomPlayer.id,
			playerName: joinRoomPlayer.name,
			avatar: getRandomAvatar(),
			state: joinRoomPlayer.isBot ? 'bot' : 'waiting',
		}

		room.players.push(newPlayer)
		const result = await room.save()

		__io.to(roomId).emit('joinRoom', newPlayer)

		const updatedPlayers = room.players
		__io.to(roomId).emit('updateRoom', updatedPlayers)

		res.status(200).json(result)
	} catch (err) {
		console.error(err)
		res.status(500).json(err)
	}
}
const leaveARoom = async (req, res) => {
	const roomId = req.params.roomId
	const playerId = req.body.id

	try {
		const room = await Room.findOne({ roomId: roomId })

		if (!room) {
			res.status(404).json({ message: 'Không tìm thấy phòng' })
			return
		}

		const playerIndex = room.players.findIndex(
			(p) => p.playerId === playerId,
		)

		console.log('🚀 ~ playerIndex:', playerIndex)

		if (playerIndex === -1) {
			res.status(404).json({ message: 'Người chơi không ở trong phòng' })
			return
		}

		if (
			room.players[playerIndex].state === 'owner' &&
			room.players.length > 1
		) {
			room.players.at(1).state = 'owner'
		}
		room.players.splice(playerIndex, 1)

		const result = await room.save()

		__io.to(roomId).emit('leaveRoom', playerId)

		const updatedPlayers = room.players
		__io.to(roomId).emit('updateRoom', updatedPlayers)

		res.status(200).json(result)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Không tìm thấy người choi' })
	}
}

const changePlayerState = async (req, res) => {
	try {
		const roomId = req.params.roomId
		const playerId = req.body.id
		const state = req.body.state

		const room = await Room.findOne({ roomId: roomId })

		if (!room) {
			res.status(404).json({ message: 'Không tìm thấy phòng' })
			return
		}

		const playerIndex = room.players.findIndex(
			(p) => p.playerId === playerId,
		)

		if (playerIndex === -1) {
			res.status(404).json({ message: 'Không tìm thấy người choi' })
			return
		}

		room.players[playerIndex].state = state
		const result = await room.save()

		const updatedPlayers = room.players
		__io.to(roomId).emit('updateRoom', updatedPlayers)

		res.status(200).json(result)
	} catch (err) {
		console.error(err)
		res.status(500).json({
			message: 'Không tìm thấy người choi',
		})
	}
}

const changeRoomRules = async (req, res) => {
	const gameRules = req.body // đổi tên cho đồng bộ
	try {
		const roomId = req.params.roomId
		const room = await Room.findOne({ roomId: roomId })

		if (!room) {
			res.status(404).json({ message: 'Không tìm thấy phòng' })
			return
		}

		room.gameRules = gameRules // đổi từ room.rules sang room.gameRules
		const result = await room.save()

		__io.to(roomId).emit('updateRoomRules', gameRules)

		res.status(200).json(result)
	} catch (err) {
		console.error(err)
		res.status(500).json({
			message: 'Không tìm thấy người choi',
		})
	}
}

export {
	getARoomInfo,
	createRoom,
	joinARoom,
	leaveARoom,
	changePlayerState,
	changeRoomRules,
}
