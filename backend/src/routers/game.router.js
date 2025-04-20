import express from 'express'
import {
	getCurrentGameState,
	startGame,
	guessPuzzle,
	hintPuzzle,
	completeAPuzzle,
} from '../controllers/game.controller.js'

const router = express.Router()

router.get('/:gameId/state', getCurrentGameState)

router.post('/:roomId/start', startGame)
router.post('/:gameId/guess', guessPuzzle)
router.post('/:gameId/hint', hintPuzzle)
router.post('/:gameId/complete', completeAPuzzle)

export default router
