import { PlayerResult } from '@/hooks/useGameResult'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

// UI Components
import { ArrowRight } from 'lucide-react'
import ResultLeaderboard from '@/components/ResultScreen/ResultLeaderboard'
import ResultPodium from '@/components/ResultScreen/ResultPodium'

export default function ResultSectionMultiPlayers({
	players,
	topPlayers,
}: {
	players: PlayerResult[]
	topPlayers: PlayerResult[]
}) {
	const navigate = useNavigate()

	return (
		<>
			<ResultPodium topPlayers={topPlayers} />

			<ResultLeaderboard players={players} />

			{/* Action buttons */}
			<div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
				<a href="/" className="flex-1 flex">
					<motion.button
						className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => navigate('/')}
					>
						<span>Chơi tiếp</span>
						<ArrowRight className="w-5 h-5" />
					</motion.button>
				</a>
			</div>
		</>
	)
}
