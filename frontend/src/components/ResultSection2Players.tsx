import ResultPlayerCard from '@/components/ResultPlayerCard'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type Players = {
	id: string
	name: string
	avatar: string
	score: number
	rank: number
	isCurrentUser: boolean
	isBot: boolean
	puzzleResults: ('playing' | 'win' | 'lost')[]
}[]

export default function ResultSection2Players({
	players,
}: {
	players: Players
}) {
	return (
		<div className="p-6 bg-white/10 backdrop-blur-xl rounded-b-2xl space-y-4">
			{/* Player 1 - Winner */}
			<ResultPlayerCard
				player={players[0]}
				playerIndex={1}
				isWinner={true}
			/>

			{/* Player 2 - Loser */}
			{players[1] && (
				<ResultPlayerCard
					player={players[1]}
					playerIndex={2}
					isWinner={false}
				/>
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
