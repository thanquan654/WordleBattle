import express from 'express'

const router = express.Router()

import roomRouter from './room.router.js'
import gameRouter from './game.router.js'

router.use('/game', gameRouter)
router.use('/room', roomRouter)

export default router
