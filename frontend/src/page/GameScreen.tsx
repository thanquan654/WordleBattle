import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Trophy,
	Clock,
	Lightbulb,
	Delete,
	CornerDownLeft,
} from 'lucide-react'
import { socket } from '@/lib/socket'
import { IRoomRules } from '@/types/type'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useLocation, useNavigate } from 'react-router'
import { checkGuess, completeAPuzzle, getBotHint } from '@/apis/apiService'
import EndRoundCard from '@/components/EndRoundCard'
import {
	setCurrentPuzzleIndex,
	setGameFinished,
	setPlayerInGame,
} from '@/store/GameSlice'
import { useAudioManager } from '@/hooks/useAudioManager'

// Game state types
type CellStatus = 'empty' | 'correct' | 'present' | 'absent' | 'tbd'

interface GameCell {
	letter: string
	feedback: CellStatus
}

export default function GameScreen() {
	const navigator = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const gameState = useSelector((state: RootState) => state.game)
	const roomState = useSelector((state: RootState) => state.room)

	const currentPlayerId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const gameRule: IRoomRules = useLocation().state
	// Game state
	const [currentRow, setCurrentRow] = useState(0)
	const [currentCol, setCurrentCol] = useState(0)
	const [board, setBoard] = useState<GameCell[][]>(
		Array(gameState.puzzles[gameState.currentPuzzleIndex].wordLength + 1)
			.fill(null)
			.map(() =>
				Array(
					gameState.puzzles[gameState.currentPuzzleIndex].wordLength,
				)
					.fill(null)
					.map(() => ({ letter: '', feedback: 'empty' })),
			),
	)
	const [boardRow, setBoardRow] = useState(
		gameState.puzzles[gameState.currentPuzzleIndex].wordLength + 1,
	)

	const [boardCol, setBoardCol] = useState(
		gameState.puzzles[gameState.currentPuzzleIndex].wordLength,
	)
	const [keyboardStatus, setKeyboardStatus] = useState<
		Record<string, CellStatus>
	>({})
	const [timeRemaining, setTimeRemaining] = useState(
		Number(gameRule.roundTime),
	)
	const [isUseActiveHint, setIsUseActiveHint] = useState(false)
	const [botHint, setBotHint] = useState<string | null>(null)
	// Timmer state
	const [isEndGame, setIsEndGame] = useState(false)

	// Current player info
	const currentPlayer = gameState.playersInGame.find(
		(p) => p.playerId === currentPlayerId,
	)
	const currentRank = currentPlayer?.rank ?? 1

	const isActiveHint =
		timeRemaining < Number(gameRule.roundTime) / 2 &&
		!isUseActiveHint &&
		gameRule.isBotHelper
	// End game card
	const [endGameCardData, setEndGameCardData] = useState({
		isFindSecretWord: false,
		currentRemainingTime: 0,
	})

	// Handle audio
	const { playSFX } = useAudioManager()

	// Handle Websocket events
	useEffect(() => {
		socket.on('nextPuzzle', ({ currentPuzzleIndex, playersInGame }) => {
			// Hiện endGameCard trước khi chuyển sang puzzle mới
			setIsEndGame(true)
			setTimeout(() => {
				dispatch(setCurrentPuzzleIndex(currentPuzzleIndex))
				dispatch(setPlayerInGame(playersInGame))

				setTimeRemaining(Number(gameRule.roundTime))
				setIsEndGame(false)

				setBoard(
					Array(gameState.puzzles[currentPuzzleIndex].wordLength + 1)
						.fill(null)
						.map(() =>
							Array(
								gameState.puzzles[currentPuzzleIndex]
									.wordLength,
							)
								.fill(null)
								.map(() => ({ letter: '', feedback: 'empty' })),
						),
				)
				setCurrentCol(0)
				setCurrentRow(0)
				setKeyboardStatus({})
				setBotHint(null)
				setIsUseActiveHint(false)
				setBoardCol(gameState.puzzles[currentPuzzleIndex].wordLength)
				setBoardRow(
					gameState.puzzles[currentPuzzleIndex].wordLength + 1,
				)
			}, 2000)
		})

		socket.on('completeAPuzzle', ({ playersInGame }) => {
			dispatch(setPlayerInGame(playersInGame))
		})

		socket.on('gameFinished', ({ game }) => {
			dispatch(setGameFinished(game))
			navigator(`/result/${gameState.gameId}`)
		})

		return () => {
			socket.off('completeAPuzzle')
			socket.off('nextPuzzle')
			socket.off('gameFinished')
		}
	}, [
		dispatch,
		gameRule.roundTime,
		gameState.currentPuzzleIndex,
		gameState.gameId,
		gameState.puzzles,
		navigator,
	])

	useEffect(() => {
		if (gameState.gameId) {
			socket.emit('subcribeRoom', gameState.gameId)
		}
	}, [gameState.gameId])

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

	// Timer effect
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 0) {
					setEndGameCardData({
						isFindSecretWord: false,
						currentRemainingTime: 0,
					})
					completeAPuzzle(
						gameState.gameId as string,
						currentPlayerId as string,
						gameState.currentPuzzleIndex,
						timeRemaining,
					)
					setIsEndGame(true)
					return 0
				}
				if (isEndGame) {
					return prev
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(timer)
			socket.off('startGame')
		}
	}, [
		currentPlayerId,
		dispatch,
		gameState.currentPuzzleIndex,
		gameState.gameId,
		isEndGame,
		timeRemaining,
	])

	// Format time as MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	// Keyboard layout
	const keyboard = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'],
	]

	// Get color class based on cell status
	const getCellColorClass = (status: CellStatus) => {
		switch (status) {
			case 'correct':
				return 'bg-green-500 border-green-500 text-white'
			case 'present':
				return 'bg-yellow-500 border-yellow-500 text-white'
			case 'absent':
				return 'bg-gray-500 border-gray-500 text-white'
			case 'tbd':
				return 'bg-gray-800 border-gray-400 text-white'
			default:
				return 'bg-transparent border-gray-300 text-black'
		}
	}

	// Get keyboard key color class
	const getKeyColorClass = (key: string) => {
		const status = keyboardStatus[key]
		switch (status) {
			case 'correct':
				return 'bg-green-500 text-white border-green-500'
			case 'present':
				return 'bg-yellow-500 text-white border-yellow-500'
			case 'absent':
				return 'bg-gray-500 text-white border-gray-500'
			default:
				return 'bg-gray-200 hover:bg-gray-300 text-black border-gray-300'
		}
	}

	// Handle keyboard input
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 15 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute opacity-5 text-white font-bold text-4xl"
						initial={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
							opacity: 0.05,
						}}
						animate={{
							y: [
								Math.random() * window.innerHeight,
								Math.random() * window.innerHeight,
							],
							opacity: [0.05, 0.1, 0.05],
						}}
						transition={{
							duration: 10 + Math.random() * 20,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: 'reverse',
						}}
					>
						{String.fromCharCode(
							65 + Math.floor(Math.random() * 26),
						)}
					</motion.div>
				))}
			</div>

			<motion.div
				className="flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden min-h-[90vh]"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between text-white">
					<button className="p-2 rounded-full hover:bg-white/20 transition">
						<ArrowLeft className="w-5 h-5" />
					</button>

					<div className="flex items-center justify-between space-x-4">
						{/* Timer */}
						<div className="flex items-center  space-x-1 bg-white/20 rounded-full px-3 py-1">
							<Clock className="w-4 h-4" />
							<span className=" font-bold">
								{formatTime(timeRemaining)}
							</span>
						</div>

						{/* Current rank and score */}
						<div className="flex items-center space-x-2 font-bold bg-white/20 rounded-full px-3 py-1">
							<span>
								{currentRank}
								<sup>
									{currentRank === 1
										? 'st'
										: currentRank === 2
										? 'nd'
										: currentRank === 3
										? 'rd'
										: 'th'}
								</sup>
							</span>
							<Trophy className="w-4 h-4 text-yellow-300" />
							<span>
								{currentPlayer?.totalScore.toLocaleString()}
							</span>
						</div>
					</div>

					{/* Bot hint button */}
					<button
						className="bg-white/20 rounded-full p-2 cursor-pointer disabled:bg-white/10 disabled:text-gray-400"
						onClick={handleUseHint}
						disabled={!isActiveHint}
					>
						<Lightbulb size={20} />
					</button>
				</div>

				{/* Round indicator */}
				<div className="relative py-3 flex justify-center">
					<span className="relative z-10 bg-white/10 px-4 py-1 text-sm font-medium text-white rounded-full border border-gray-300">
						Vòng: {gameState.currentPuzzleIndex + 1}/
						{gameRule.gameRound}
					</span>
				</div>

				{/* Hiển thị gợi ý bot nếu có */}
				{botHint && (
					<div className="text-center text-yellow-300 font-bold py-2">
						Gợi ý bot: <span className="underline">{botHint}</span>
					</div>
				)}

				{/* Game board */}
				<div className="p-4 flex flex-col justify-start items-center flex-1">
					<div
						className={`grid gap-1.5`}
						style={{
							gridTemplateRows: `repeat(${boardRow}, minmax(0, 1fr))`,
						}}
					>
						{board.map((row, rowIndex) => (
							<div
								key={rowIndex}
								className={`grid gap-1.5`}
								style={{
									gridTemplateColumns: `repeat(${boardCol}, minmax(0, 1fr))`,
								}}
							>
								{row.map((cell, colIndex) => (
									<motion.div
										key={`${rowIndex}-${colIndex}`}
										className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold ${getCellColorClass(
											cell.feedback,
										)}`}
										initial={{
											scale: cell.letter ? 0.8 : 1,
										}}
										animate={{
											scale: 1,
											rotateX:
												cell.feedback !== 'empty' &&
												cell.feedback !== 'tbd'
													? [0, 90, 0]
													: 0,
										}}
										transition={{
											duration: 0.3,
											delay: colIndex * 0.1,
											ease: 'easeInOut',
										}}
									>
										{cell.letter}
									</motion.div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Virtual keyboard */}
				<div className="p-2 py-4 pt-2 md:p-4">
					<div className="grid gap-1.5 relative w-full md:w-auto">
						{isEndGame && (
							<div className="inset-0 absolute p-4 bg-gray-400 opacity-95  flex items-center justify-center rounded-md">
								<EndRoundCard
									isFindSecretWord={
										endGameCardData.isFindSecretWord
									}
									currentRemainingTime={
										endGameCardData.currentRemainingTime
									}
								/>
							</div>
						)}
						{keyboard.map((row, rowIndex) => (
							<div
								key={rowIndex}
								className="flex justify-center gap-1.5 w-full md:w-auto"
							>
								{row.map((key) => (
									<motion.button
										key={key}
										onClick={() => handleKeyPress(key)}
										className={`flex-1 md:flex-auto flex justify-center items-center py-3 sm:py-4 rounded-md font-medium border transition-colors text-center ${
											key === 'ENTER' || key === '⌫'
												? 'text-xs'
												: ''
										} ${getKeyColorClass(key)}`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{key === '⌫' ? (
											<Delete className="w-6 h-4 " />
										) : key === 'ENTER' ? (
											<CornerDownLeft className="w-6 h-4" />
										) : (
											key
										)}
									</motion.button>
								))}
							</div>
						))}
					</div>
				</div>
			</motion.div>
		</div>
	)
}
