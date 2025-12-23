import { motion } from 'framer-motion'
import { CellStatus } from '@/page/GameScreen'
import EndRoundCard from '@/components/EndRoundCard'
import { CornerDownLeft, Delete } from 'lucide-react'

export default function GameKeyboard({
	isEndGame,
	endGameCardData,
	handleKeyPress,
	keyboardStatus,
}: {
	isEndGame: boolean
	endGameCardData: {
		isFindSecretWord: boolean
		currentRemainingTime: number
	}
	handleKeyPress: (key: string) => void
	keyboardStatus: {
		[x: string]: CellStatus
	}
}) {
	// Keyboard layout
	const keyboard = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'],
	]

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

	return (
		<div className="p-2 py-4 pt-2 md:p-4">
			<div className="grid gap-1.5 relative w-full md:w-auto">
				{isEndGame && (
					<div className="inset-0 absolute p-4 bg-gray-400 opacity-95  flex items-center justify-center rounded-md">
						<EndRoundCard
							isFindSecretWord={endGameCardData.isFindSecretWord}
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
	)
}
