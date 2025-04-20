import express from 'express'
import {
	getARoomInfo,
	createRoom,
	joinARoom,
	leaveARoom,
	changePlayerState,
	changeRoomRules,
} from '../controllers/room.controller.js'

const router = express.Router()

// Get info of a room
router.get('/:roomId', getARoomInfo)

// Create a room
router.post('/', createRoom)

router.post('/:roomId/join', joinARoom)
router.post('/:roomId/leave', leaveARoom)
router.post('/:roomId/state', changePlayerState)
router.post('/:roomId/rules', changeRoomRules)

export default router
