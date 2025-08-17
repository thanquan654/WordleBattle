import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { socket } from '@/lib/socket'
import {
	setCurrentPuzzleIndex,
	setGameFinished,
	setPlayerInGame,
} from '@/store/GameSlice'

interface UseGameSocketProps {
	gameId: string
	gameRule: any
	currentPuzzleIndex: number
	onNextPuzzle: () => void
}

export const useGameSocket = ({
	gameId,
	gameRule,
	currentPuzzleIndex,
	onNextPuzzle,
}: UseGameSocketProps) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	// Wrap socket event handlers in useCallback
	const handleNextPuzzle = useCallback(
		(data: any) => {
			dispatch(setCurrentPuzzleIndex(data.currentPuzzleIndex))
			onNextPuzzle()
		},
		[dispatch, onNextPuzzle],
	)

	const handleCompleteAPuzzle = useCallback(
		(data: any) => {
			dispatch(setPlayerInGame(data.playersInGame))
		},
		[dispatch],
	)

	const handleGameFinished = useCallback(
		(data: any) => {
			dispatch(setGameFinished(data.game))
			navigate(`/result/${gameId}`)
		},
		[dispatch, navigate, gameId],
	)

	// Split socket connection and event listeners
	useEffect(() => {
		if (gameId) {
			socket.emit('subcribeRoom', gameId)
		}

		return () => {
			socket.emit('unsubscribeRoom', gameId)
		}
	}, [gameId])

	// Register event listeners separately
	useEffect(() => {
		socket.on('nextPuzzle', handleNextPuzzle)
		socket.on('completeAPuzzle', handleCompleteAPuzzle)
		socket.on('gameFinished', handleGameFinished)

		return () => {
			socket.off('nextPuzzle', handleNextPuzzle)
			socket.off('completeAPuzzle', handleCompleteAPuzzle)
			socket.off('gameFinished', handleGameFinished)
		}
	}, [handleNextPuzzle, handleCompleteAPuzzle, handleGameFinished])
}
