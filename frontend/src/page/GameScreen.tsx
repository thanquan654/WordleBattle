import { useState } from 'react'
import { ArrowLeft, Trophy, Clock, Lightbulb } from 'lucide-react'
import { IRoomRules } from '@/types/type'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useLocation, useNavigate } from 'react-router'
import { completeAPuzzle } from '@/apis/apiService'
import { motion, AnimatePresence } from 'framer-motion'

import AnimatedBackground from '@/components/AnimatedBackground'
import MainPagePanel from '@/components/MainPagePanel'
import AppBackground from '@/components/AppBackground'
import GameHeader from '@/components/GameHeader'
import GameKeyboard from '@/components/GameScreen/GameKeyboard'
import GameBoard from '@/components/GameScreen/GameBoard'
import { useGameSocket } from '@/hooks/useGameSocket'
import { useGameTimer } from '@/hooks/useGameTimer'
import useGameHint from '@/hooks/useGameHint'
import useGameBoard from '@/hooks/useGameBoard'

// Game state types
export type CellStatus = 'empty' | 'correct' | 'present' | 'absent' | 'tbd'

export type GameCell = {
	letter: string
	feedback: CellStatus
}

export default function GameScreen() {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const gameState = useSelector((state: RootState) => state.game)

	const gameRule: IRoomRules = useLocation().state

	const [isEndGame, setIsEndGame] = useState(false)

	// End game card
	const [endGameCardData, setEndGameCardData] = useState({
		isFindSecretWord: false,
		currentRemainingTime: 0,
	})

	// Current player info
	const currentPlayerId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const currentPlayer = gameState.playersInGame.find(
		(p) => p.playerId === currentPlayerId,
	)
	const currentRank = currentPlayer?.rank ?? 1

	const { timeRemaining, setTimeRemaining, formatTime } = useGameTimer({
		initialTime: Number(gameRule.roundTime),
		onTimeUp: () => {
			completeAPuzzle(
				gameState.gameId as string,
				currentPlayerId as string,
				gameState.currentPuzzleIndex,
				timeRemaining,
			)
		},
		isEndGame,
	})

	const {
		board,
		currentRow,
		boardCol,
		boardRow,
		handleKeyPress,
		keyboardStatus,
		initializeNewPuzzle,
	} = useGameBoard({
		gameState,
		timeRemaining,
		setIsEndGame,
		setEndGameCardData,
		currentPlayerId,
	})

	useGameSocket({
		gameId: gameState.gameId as string,
		gameRule: gameRule,
		currentPuzzleIndex: gameState.currentPuzzleIndex,
		onNextPuzzle: () => {
			setIsEndGame(true)

			setTimeout(() => {
				const nextPuzzleIndex = gameState.currentPuzzleIndex + 1
				setTimeRemaining(Number(gameRule.roundTime))
				setIsEndGame(false)
				initializeNewPuzzle(
					gameState.puzzles[nextPuzzleIndex].wordLength,
				)
			}, 2000)
		},
	})

	const { botHint, handleUseHint, isActiveHint } = useGameHint({
		timeRemaining,
		gameRule,
		board,
		currentRow,
		gameState,
	})

	return (
		<AppBackground className="p-4">
			{/* Animated background elements */}
			<AnimatedBackground variant="character" />

			<MainPagePanel className="min-h-[90vh] flex flex-col">
				{/* Header */}
				<GameHeader>
					<button
						className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
						onClick={() => navigate('/')}
					>
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
						className="bg-white/20 rounded-full p-2 cursor-pointer disabled:bg-white/10 disabled:text-gray-400 transition-all hover:scale-110 active:scale-95"
						onClick={handleUseHint}
						disabled={!isActiveHint}
					>
						<Lightbulb
							size={20}
							className={isActiveHint ? 'text-yellow-300' : ''}
						/>
					</button>
				</GameHeader>

				{/* Round indicator */}
				<div className="relative py-3 flex justify-center">
					<span className="relative z-10 bg-white/10 px-4 py-1 text-sm font-medium text-white rounded-full border border-gray-300">
						Vòng: {gameState.currentPuzzleIndex + 1}/
						{gameRule.gameRound}
					</span>
				</div>

				{/* Hiển thị gợi ý bot nếu có */}
				<AnimatePresence>
					{botHint && (
						<motion.div
							initial={{ opacity: 0, y: -20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							className="mx-auto mb-4"
						>
							<div className="bg-yellow-400/20 backdrop-blur-md border border-yellow-400/50 rounded-2xl px-6 py-2 flex items-center space-x-3 shadow-lg shadow-yellow-400/10">
								<div className="bg-yellow-400 rounded-full p-1">
									<Lightbulb
										size={16}
										className="text-black"
									/>
								</div>
								<div className="flex flex-col">
									<span className="text-[10px] uppercase tracking-wider font-bold text-yellow-200/80 leading-none mb-1">
										Gợi ý từ Bot
									</span>
									<span className="text-xl font-black text-yellow-300 tracking-[0.2em] uppercase leading-none">
										{botHint}
									</span>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Game board */}
				<GameBoard
					board={board}
					boardCol={boardCol}
					boardRow={boardRow}
				/>

				{/* Virtual keyboard */}
				<GameKeyboard
					isEndGame={isEndGame}
					endGameCardData={endGameCardData}
					handleKeyPress={handleKeyPress}
					keyboardStatus={keyboardStatus}
				/>
			</MainPagePanel>
		</AppBackground>
	)
}
