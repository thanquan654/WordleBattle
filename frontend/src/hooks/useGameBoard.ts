import { checkGuess, completeAPuzzle } from '@/apis/apiService'
import { useAudioManager } from '@/hooks/useAudioManager'
import { CellStatus, GameCell } from '@/page/GameScreen'
import { useState } from 'react'

export default function useGameBoard({
	gameState,
	timeRemaining,
	setIsEndGame,
	setEndGameCardData,
	currentPlayerId,
}: any) {
	const { playSFX } = useAudioManager()

	const [currentRow, setCurrentRow] = useState(0)
	const [currentCol, setCurrentCol] = useState(0)
	const [boardCol, setBoardCol] = useState(
		gameState.puzzles[gameState.currentPuzzleIndex].wordLength,
	)
	const [boardRow, setBoardRow] = useState(
		gameState.puzzles[gameState.currentPuzzleIndex].wordLength + 1,
	)

	const [board, setBoard] = useState<GameCell[][]>(
		Array(boardRow)
			.fill(null)
			.map(() =>
				Array(boardCol)
					.fill(null)
					.map(() => ({ letter: '', feedback: 'empty' })),
			),
	)

	const [keyboardStatus, setKeyboardStatus] = useState<
		Record<string, CellStatus>
	>({})

	const handleKeyPress = (key: string) => {
		if (currentRow >= boardRow) return // Game over

		if (key === '⌫') {
			// Xóa ký tự
			playSFX('type_letter')
			if (currentCol > 0) {
				const newBoard = [...board]
				newBoard[currentRow][currentCol - 1] = {
					letter: '',
					feedback: 'empty',
				}
				setBoard(newBoard)
				setCurrentCol(currentCol - 1)
			}
		} else if (key === 'ENTER') {
			// Kiểm tra từ
			playSFX('type_letter')
			if (currentCol === boardCol) {
				checkWord()
				setCurrentRow(currentRow + 1)
				setCurrentCol(0)
			}
		} else if (currentCol < boardCol) {
			// Nhập ký tự
			playSFX('type_letter')
			const newBoard = [...board]
			newBoard[currentRow][currentCol] = { letter: key, feedback: 'tbd' }
			setBoard(newBoard)
			setCurrentCol(currentCol + 1)
		}
	}

	// Check word against solution
	const checkWord = async () => {
		// Get current word
		const currentWord = board[currentRow]
			.map((cell) => cell.letter)
			.join('')

		const response = await checkGuess(
			gameState.gameId as string,
			currentPlayerId as string,
			gameState.currentPuzzleIndex,
			currentWord,
			timeRemaining,
		)

		console.log('🚀 ~ response:', response)

		if (response?.status === 205) {
			const newBoard = [...board]
			newBoard[currentRow] = Array(boardCol).fill({
				letter: '',
				feedback: 'empty',
			})

			setCurrentRow(currentRow)
			setBoard(newBoard)
			return
		}

		const guessRespone = response?.data.guessWord
			.split('')
			.map((letter: string, index: number) => ({
				letter,
				feedback: response?.data.feedback[index],
			}))

		const newBoard = [...board]
		newBoard[currentRow] = guessRespone

		const newKeyboardStatus = { ...keyboardStatus }
		guessRespone.forEach(
			(cell: { letter: string; feedback: CellStatus }) => {
				newKeyboardStatus[cell.letter] = cell.feedback
			},
		)

		const isCorrect = guessRespone.every(
			(cell: { letter: string; feedback: CellStatus }) =>
				cell.feedback === 'correct',
		)

		if (isCorrect) {
			playSFX('solve_secret_word')
			setEndGameCardData({
				isFindSecretWord: true,
				currentRemainingTime: timeRemaining,
			})
			setIsEndGame(true)
			completeAPuzzle(
				gameState.gameId as string,
				currentPlayerId as string,
				gameState.currentPuzzleIndex,
				timeRemaining,
			)
		} else if (currentRow + 1 === boardRow) {
			playSFX('wrong_secret_word')
			// Hết lượt mà chưa đúng
			setEndGameCardData({
				isFindSecretWord: false,
				currentRemainingTime: timeRemaining,
			})
			setIsEndGame(true)
			completeAPuzzle(
				gameState.gameId as string,
				currentPlayerId as string,
				gameState.currentPuzzleIndex,
				timeRemaining,
			)
		} else {
			playSFX('wrong_secret_word')
		}

		setBoard(newBoard)
		setKeyboardStatus(newKeyboardStatus)
	}

	const initializeNewPuzzle = (newWordLength: number) => {
		setBoard(
			Array(newWordLength + 1)
				.fill(null)
				.map(() =>
					Array(newWordLength)
						.fill(null)
						.map(() => ({ letter: '', feedback: 'empty' })),
				),
		)
		setCurrentCol(0)
		setCurrentRow(0)
		setKeyboardStatus({})
		setBoardCol(newWordLength)
		setBoardRow(newWordLength + 1)
	}

	return {
		board,
		currentRow,
		currentCol,
		boardCol,
		boardRow,
		keyboardStatus,
		handleKeyPress,
		checkWord,
		initializeNewPuzzle,
	}
}
