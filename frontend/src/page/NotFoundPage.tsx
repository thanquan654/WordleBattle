'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router'

type CellStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

interface GameCell {
	letter: string
	status: CellStatus
}

export default function Custom404Page() {
	// Animation sequence state
	const [animationStep, setAnimationStep] = useState(0)
	const [showKeyboard, setShowKeyboard] = useState(false)

	// Define the 404 word game board
	const initialBoard: GameCell[][] = [
		// First attempt - "WHERE"
		[
			{ letter: 'W', status: 'absent' },
			{ letter: 'H', status: 'absent' },
			{ letter: 'E', status: 'absent' },
			{ letter: 'R', status: 'absent' },
			{ letter: 'E', status: 'absent' },
		],
		// Second attempt - "FOUND"
		[
			{ letter: 'F', status: 'absent' },
			{ letter: 'O', status: 'absent' },
			{ letter: 'U', status: 'absent' },
			{ letter: 'N', status: 'absent' },
			{ letter: 'D', status: 'absent' },
		],
		// Third attempt - "ERROR"
		[
			{ letter: 'E', status: 'present' },
			{ letter: 'R', status: 'present' },
			{ letter: 'R', status: 'present' },
			{ letter: 'O', status: 'present' },
			{ letter: 'R', status: 'present' },
		],
		// Fourth attempt - "PAGE?"
		[
			{ letter: 'P', status: 'absent' },
			{ letter: 'A', status: 'absent' },
			{ letter: 'G', status: 'absent' },
			{ letter: 'E', status: 'absent' },
			{ letter: '?', status: 'absent' },
		],
		// Fifth attempt - "4-0-4"
		[
			{ letter: '4', status: 'correct' },
			{ letter: '0', status: 'correct' },
			{ letter: '4', status: 'correct' },
			{ letter: '', status: 'empty' },
			{ letter: '', status: 'empty' },
		],
		// Empty row
		[
			{ letter: '', status: 'empty' },
			{ letter: '', status: 'empty' },
			{ letter: '', status: 'empty' },
			{ letter: '', status: 'empty' },
			{ letter: '', status: 'empty' },
		],
	]

	const [board, setBoard] = useState<GameCell[][]>(
		initialBoard.map((row) =>
			row.map((cell) => ({ ...cell, status: 'empty' })),
		),
	)

	// Keyboard layout
	const keyboard = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
	]

	// Animation sequence
	useEffect(() => {
		const revealSequence = [
			// Reveal first row (WHERE)
			() => {
				const newBoard = [...board]
				for (let i = 0; i < 5; i++) {
					newBoard[0][i] = { ...initialBoard[0][i] }
				}
				setBoard(newBoard)
			},
			// Reveal second row (FOUND)
			() => {
				const newBoard = [...board]
				for (let i = 0; i < 5; i++) {
					newBoard[1][i] = { ...initialBoard[1][i] }
				}
				setBoard(newBoard)
			},
			// Reveal third row (ERROR)
			() => {
				const newBoard = [...board]
				for (let i = 0; i < 5; i++) {
					newBoard[2][i] = { ...initialBoard[2][i] }
				}
				setBoard(newBoard)
			},
			// Reveal fourth row (PAGE?)
			() => {
				const newBoard = [...board]
				for (let i = 0; i < 5; i++) {
					newBoard[3][i] = { ...initialBoard[3][i] }
				}
				setBoard(newBoard)
			},
			// Reveal fifth row (404)
			() => {
				const newBoard = [...board]
				for (let i = 0; i < 3; i++) {
					newBoard[4][i] = { ...initialBoard[4][i] }
				}
				setBoard(newBoard)
			},
			// Show keyboard
			() => {
				setShowKeyboard(true)
			},
		]

		if (animationStep < revealSequence.length) {
			const timer = setTimeout(
				() => {
					revealSequence[animationStep]()
					setAnimationStep(animationStep + 1)
				},
				animationStep === 0 ? 500 : 1000,
			)

			return () => clearTimeout(timer)
		}
	}, [animationStep, board, initialBoard])

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
				return 'bg-white border-gray-400 text-black'
			default:
				return 'bg-transparent border-gray-300 text-black dark:border-gray-700'
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 20 }).map((_, i) => (
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
				className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 flex flex-col items-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<motion.h1
					className="text-3xl font-bold text-white mb-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					Page Not Found
				</motion.h1>

				<motion.p
					className="text-gray-300 mb-8 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					Looks like you're trying to find a page that doesn't
					exist...
				</motion.p>

				{/* Game board */}
				<div className="mb-8">
					<div className="grid grid-rows-6 gap-1.5">
						{board.map((row, rowIndex) => (
							<div
								key={rowIndex}
								className="grid grid-cols-5 gap-1.5"
							>
								{row.map((cell, colIndex) => (
									<motion.div
										key={`${rowIndex}-${colIndex}`}
										className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold ${getCellColorClass(
											cell.status,
										)}`}
										initial={{ rotateX: 0 }}
										animate={{
											rotateX:
												cell.status !== 'empty'
													? [0, 90, 0]
													: 0,
										}}
										transition={{
											duration: 0.3,
											delay: colIndex * 0.1,
											type: 'spring',
										}}
									>
										{cell.letter}
									</motion.div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Action buttons */}
				<motion.div
					className="flex gap-4 w-full"
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: showKeyboard ? 1 : 0,
						y: showKeyboard ? 0 : 20,
					}}
					transition={{ duration: 0.5 }}
				>
					<Link to="/" className="flex-1">
						<motion.button
							className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Home className="w-5 h-5" />
							<span>Go Home</span>
						</motion.button>
					</Link>

					<motion.button
						className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => window.location.reload()}
					>
						<RefreshCcw className="w-5 h-5" />
						<span>Try Again</span>
					</motion.button>
				</motion.div>

				{/* Message */}
				<motion.p
					className="text-gray-400 mt-6 text-center text-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: showKeyboard ? 1 : 0 }}
					transition={{ delay: 0.8 }}
				>
					The word was "PAGE" but we got a "404" instead!
				</motion.p>
			</motion.div>
		</div>
	)
}
