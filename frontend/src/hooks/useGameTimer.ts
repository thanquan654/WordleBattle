import { useState, useEffect } from 'react'

interface UseGameTimerProps {
	initialTime: number
	onTimeUp: () => void
	isEndGame: boolean
}

export const useGameTimer = ({
	initialTime,
	onTimeUp,
	isEndGame,
}: UseGameTimerProps) => {
	const [timeRemaining, setTimeRemaining] = useState(initialTime)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 0) {
					onTimeUp()
					return 0
				}
				if (isEndGame) {
					return prev
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [initialTime, isEndGame, onTimeUp])

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return {
		timeRemaining,
		setTimeRemaining,
		formatTime,
	}
}
