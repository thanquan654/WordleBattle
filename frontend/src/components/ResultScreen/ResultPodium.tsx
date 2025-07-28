import { PlayerResult } from '@/hooks/useGameResult'
import { motion } from 'framer-motion'
import { Award, Crown, Medal } from 'lucide-react'

export default function ResultPodium({
	topPlayers,
}: {
	topPlayers: PlayerResult[]
}) {
	const getMedalIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-6 h-6 text-yellow-500" />
			case 2:
				return <Medal className="w-5 h-5 text-gray-400" />
			case 3:
				return <Award className="w-5 h-5 text-amber-700" />
			default:
				return null
		}
	}

	return (
		<div className="p-6 bg-white/10 backdrop-blur-xl">
			<div className="flex items-end justify-center gap-4 h-[250px] ">
				{/* 2nd Place */}
				<motion.div
					className="flex flex-col items-center"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="relative">
						<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
							{getMedalIcon(2)}
						</div>
						<div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-300">
							<img
								src={
									topPlayers[1]?.avatar || '/placeholder.svg'
								}
								alt={topPlayers[1]?.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="text-center mt-2">
						<div className="font-medium text-sm">
							{topPlayers[1]?.name}
						</div>
						<div className="text-gray-400 font-bold">
							{topPlayers[1]?.score.toLocaleString()}
						</div>
					</div>
					<div className="w-20 h-[80px] bg-gray-300 rounded-t-lg mt-2 flex items-center justify-center">
						<span className="text-2xl font-bold text-gray-700">
							2
						</span>
					</div>
				</motion.div>

				{/* 1st Place */}
				<motion.div
					className="flex flex-col items-center"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div className="relative">
						<div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
							{getMedalIcon(1)}
						</div>
						<div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400">
							<img
								src={
									topPlayers[0]?.avatar || '/placeholder.svg'
								}
								alt={topPlayers[0]?.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="text-center mt-2">
						<div className="font-bold">{topPlayers[0]?.name}</div>
						<div className="text-yellow-500 font-bold">
							{topPlayers[0]?.score.toLocaleString()}
						</div>
					</div>
					<div className="w-24 h-[100px] bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
						<span className="text-3xl font-bold text-yellow-800">
							1
						</span>
					</div>
				</motion.div>

				{/* 3rd Place */}
				<motion.div
					className="flex flex-col items-center"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<div className="relative">
						<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
							{getMedalIcon(3)}
						</div>
						<div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-700">
							<img
								src={
									topPlayers[2]?.avatar || '/placeholder.svg'
								}
								alt={topPlayers[2]?.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="text-center mt-2">
						<div className="font-medium text-sm">
							{topPlayers[2]?.name}
						</div>
						<div className="text-amber-700 font-bold">
							{topPlayers[2]?.score.toLocaleString()}
						</div>
					</div>
					<div className="w-20 h-[60px] bg-amber-700 rounded-t-lg mt-2 flex items-center justify-center">
						<span className="text-2xl font-bold text-amber-100">
							3
						</span>
					</div>
				</motion.div>
			</div>
		</div>
	)
}
