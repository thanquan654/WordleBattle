import { motion } from 'framer-motion'

export default function GameLogo() {
	return (
		<div className="flex justify-center mb-8">
			<div className="grid grid-rows-2 gap-2">
				{/* WORDLE row */}
				<div className="flex space-x-1">
					{['W', 'O', 'R', 'D', 'L', 'E'].map((letter, index) => (
						<motion.div
							key={`wordle-${index}`}
							className={`${
								index % 3 === 0
									? 'bg-[#6aaa64]'
									: // Green (correct)
									index % 3 === 1
									? 'bg-[#c9b458]'
									: // Yellow (present)
									  'bg-[#787c7e]' // Gray (absent)
							} w-10 h-10 flex items-center justify-center rounded-md text-white font-bold text-xl shadow-lg`}
							initial={{ rotateX: 0 }}
							animate={{ rotateX: 360 }}
							transition={{
								duration: 1.5,
								delay: index * 0.1,
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 5,
							}}
						>
							{letter}
						</motion.div>
					))}
				</div>

				{/* BATTLE row */}
				<div className="flex space-x-1">
					{['B', 'A', 'T', 'T', 'L', 'E'].map((letter, index) => (
						<motion.div
							key={`battle-${index}`}
							className={`${
								index % 3 === 0
									? 'bg-[#787c7e]'
									: // Gray (absent)
									index % 3 === 1
									? 'bg-[#6aaa64]'
									: // Green (correct)
									  'bg-[#c9b458]' // Yellow (present)
							} w-10 h-10 flex items-center justify-center rounded-md text-white font-bold text-xl shadow-lg`}
							initial={{ rotateX: 0 }}
							animate={{ rotateX: 360 }}
							transition={{
								duration: 1.5,
								delay: index * 0.1 + 0.3,
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 5,
							}}
						>
							{letter}
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}
