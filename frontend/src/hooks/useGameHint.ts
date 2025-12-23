import { getBotHint } from '@/apis/apiService'
import { useState, useEffect } from 'react'

export default function useGameHint({
	timeRemaining,
	gameRule,
	board,
	currentRow,
	gameState,
}) {
	const [isUseActiveHint, setIsUseActiveHint] = useState(false)
	const [botHint, setBotHint] = useState<string | null>(null)

	// Reset hint when puzzle changes
	useEffect(() => {
		setBotHint(null)
		setIsUseActiveHint(false)
	}, [gameState.currentPuzzleIndex])

	const isActiveHint =
		timeRemaining < Number(gameRule.roundTime) / 2 &&
		!isUseActiveHint &&
		gameRule.isBotHelper

	const handleUseHint = async () => {
		if (!isActiveHint) return

		// Lấy previousGuesses từ board
		const previousGuesses = board
			.slice(0, currentRow) // chỉ lấy các dòng đã nhập xong
			.filter((row) =>
				row.every(
					(cell) =>
						cell.letter &&
						cell.feedback !== 'empty' &&
						cell.feedback !== 'tbd',
				),
			)
			.map((row) => ({
				guessWord: row.map((cell) => cell.letter).join(''),
				feedback: row.map((cell) => cell.feedback),
			}))

		const wordLength =
			gameState.puzzles[gameState.currentPuzzleIndex].wordLength

		const res = await getBotHint(
			gameState.gameId as string,
			previousGuesses,
			wordLength,
		)
		if (res?.hint) {
			setBotHint(res.hint)
			setIsUseActiveHint(true)
		}
	}

	return {
		isActiveHint,
		botHint,
		handleUseHint,
	}
}
