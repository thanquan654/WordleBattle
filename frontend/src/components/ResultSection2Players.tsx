import { motion } from 'framer-motion'
import { ArrowRight, Crown, Medal } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function ResultSection2Players({ players }) {
	const navigate = useNavigate()
	return (
		<div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl space-y-4">
			{/* Player 1 - Winner */}
			<motion.div
				className="border-4 border-yellow-400 rounded-2xl p-4 relative overflow-hidden bg-white/60"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				{/* Win Badge */}
				<div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-br-lg font-bold tracking-wider text-sm flex items-center gap-1">
					<Crown className="w-4 h-4" />
					WIN
				</div>

				{/* Score */}
				<div className="mt-8 mb-4">
					<div className="text-4xl font-bold text-yellow-800 tracking-widest">
						{players[0]?.score?.toLocaleString()}
					</div>
					<div className="text-xs text-yellow-700 tracking-wider">
						Điểm
					</div>
				</div>

				{/* Player Info */}
				<div className="flex justify-end items-center mt-2">
					<div className="text-right mr-3">
						<div className="text-sm text-gray-800 font-bold">
							{players[0]?.name}
						</div>
						<div className="text-xs text-yellow-700">
							Người chơi 1
						</div>
					</div>
					<div className="w-12 h-12 bg-yellow-100 rounded-full overflow-hidden border-4 border-yellow-400">
						<img
							src={players[0]?.avatar || '/placeholder.svg'}
							alt="Player 1"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
			</motion.div>

			{/* Player 2 - Loser */}
			{players[1] && (
				<motion.div
					className="border-4 border-gray-300 rounded-2xl p-4 relative overflow-hidden bg-white/40"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.4 }}
				>
					{/* Loss Badge */}
					<div className="absolute top-0 left-0 bg-gray-300 text-gray-700 px-4 py-1 rounded-br-lg font-bold tracking-wider text-sm flex items-center gap-1">
						<Medal className="w-4 h-4" />
						LOSS
					</div>

					{/* Score */}
					<div className="mt-8 mb-4">
						<div className="text-4xl font-bold text-gray-700 tracking-widest">
							{players[1]?.score?.toLocaleString()}
						</div>
						<div className="text-xs text-gray-500 tracking-wider">
							Điểm
						</div>
					</div>

					{/* Player Info */}
					<div className="flex justify-end items-center mt-2">
						<div className="text-right mr-3">
							<div className="text-sm text-gray-800 font-bold">
								{players[1]?.name}
							</div>
							<div className="text-xs text-gray-500">
								Người chơi 2
							</div>
						</div>
						<div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-4 border-gray-300">
							<img
								src={players[1]?.avatar || '/placeholder.svg'}
								alt="Player 2"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</motion.div>
			)}

			{/* Action Buttons */}
			<div className="flex justify-center gap-4 mt-8">
				<a href="/">
					<motion.button
						className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<span>Chơi tiếp</span>
						<ArrowRight className="w-5 h-5" />
					</motion.button>
				</a>
			</div>
		</div>
	)
}
