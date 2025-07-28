import { motion } from 'framer-motion'
import { Crown, Diamond, Medal } from 'lucide-react'

type Player = {
	id: string
	name: string
	avatar: string
	score: number
	rank: number
	isCurrentUser: boolean
	isBot: boolean
	puzzleResults: ('playing' | 'win' | 'lost')[]
}

export default function ResultPlayerCard({
	player,
	playerIndex,
	isWinner,
}: {
	player: Player
	playerIndex: number
	isWinner: boolean
}) {
	return (
		<motion.div
			className={`border-4  rounded-2xl p-4 relative overflow-hidden bg-white/60 ${
				isWinner ? 'border-yellow-400' : 'border-gray-300'
			}`}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, delay: 0.2 }}
		>
			{/* Win/LOSE Badge */}
			<div
				className={`absolute top-0 left-0  px-4 py-1 rounded-br-lg font-bold tracking-wider text-sm flex items-center gap-1 ${
					isWinner
						? 'bg-yellow-400 text-yellow-700'
						: 'bg-gray-300 text-gray-700'
				}`}
			>
				{isWinner ? (
					<>
						<Crown className="w-4 h-4" />
						WIN
					</>
				) : (
					<>
						<Medal className="w-4 h-4" />
						LOSS
					</>
				)}
			</div>

			{/* Score */}
			<div className="mt-8 mb-4">
				<div className="flex items-center gap-2 mt-2">
					{player?.puzzleResults?.map((status, idx) => (
						<Diamond
							key={idx}
							className={`w-5 h-5 ${
								status === 'win'
									? 'text-cyan-500'
									: 'text-gray-400'
							}`}
							fill={status === 'win' ? '#06b6d4' : '#d1d5db'}
						/>
					))}
				</div>
				<div
					className={`text-4xl font-bold my-1  tracking-widest ${
						isWinner ? 'text-yellow-700' : 'text-gray-700'
					}`}
				>
					{player?.score?.toLocaleString()}
				</div>
				<div
					className={`text-xs  tracking-wider ${
						isWinner ? 'text-yellow-400' : 'text-gray-600'
					}`}
				>
					Điểm
				</div>
			</div>

			{/* Player Info */}
			<div className="flex justify-end items-center mt-2">
				<div className="text-right mr-3">
					<div className="text-sm text-gray-800 font-bold">
						{player?.name}
					</div>
					<div
						className={`text-xs ${
							isWinner ? 'text-yellow-700' : 'text-gray-500'
						}`}
					>
						Người chơi {playerIndex}{' '}
						{player?.isBot && (
							<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
								Bot
							</span>
						)}
					</div>
				</div>
				<div
					className={`w-12 h-12  rounded-full overflow-hidden border-4 ${
						isWinner
							? 'bg-yellow-100 border-yellow-400'
							: 'bg-gray-100 border-gray-300'
					}`}
				>
					<img
						src={player?.avatar || '/placeholder.svg'}
						alt={`Player ${playerIndex}`}
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		</motion.div>
	)
}
