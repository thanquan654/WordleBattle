import { CellStatus, GameCell } from '@/page/GameScreen'
import { motion } from 'framer-motion'

export default function GameBoard({
	boardRow,
	boardCol,
	board,
}: {
	boardRow: number
	boardCol: number
	board: GameCell[][]
}) {
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

	return (
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
	)
}
