import { PlayerResult } from '@/hooks/useGameResult'
import { motion } from 'framer-motion'
import { Diamond, Star } from 'lucide-react'

export default function ResultLeaderboard({
	players,
}: {
	players: PlayerResult[]
}) {
	return (
		<div className="px-6 py-4">
			<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
				<Star className="w-5 h-5 text-yellow-500" />
				<span className="text-yellow-500">BXH tổng</span>
			</h2>

			<div className="bg-gray-500 rounded-xl border border-gray-200 overflow-hidden mb-6">
				{/* Header row */}
				<div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium text-gray-600">
					<div className="col-span-2 text-center">Hạng</div>
					<div className="col-span-5">Người chơi</div>
					<div className="col-span-5 text-right">Điểm</div>
				</div>

				{/* Player rows */}
				<div className="max-h-[240px] overflow-y-auto">
					{players.map((player) => (
						<motion.div
							key={player.id}
							className={`grid grid-cols-12 p-3 text-sm border-t border-gray-200 ${
								player.isCurrentUser
									? 'bg-blue-50 border-l-4 border-l-blue-500'
									: 'hover:bg-gray-50'
							}`}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.3,
								delay: player.rank * 0.05,
							}}
						>
							<div className="col-span-2 flex justify-center items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
										player.rank === 1
											? 'bg-yellow-100 text-yellow-800'
											: player.rank === 2
											? 'bg-gray-100 text-gray-800'
											: player.rank === 3
											? 'bg-amber-100 text-amber-800'
											: 'bg-gray-100 text-gray-600'
									}`}
								>
									{player.rank}
								</div>
							</div>
							<div className="col-span-5 flex items-center gap-2">
								<div className="w-8 h-8 rounded-full overflow-hidden">
									<img
										src={
											player.avatar || '/placeholder.svg'
										}
										alt={player.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="font-medium text-gray-800 flex items-center gap-2">
									{player.name}
									{player.isBot && (
										<span className="text-xs text-blue-600">
											(Bot)
										</span>
									)}
									{player.isCurrentUser && (
										<span className="text-xs text-green-600">
											(Bạn)
										</span>
									)}
								</div>
							</div>
							<div className="col-span-5 text-right font-medium text-gray-800 flex justify-end items-center gap-2">
								{/* Hiển thị chuỗi win/lost */}
								<div className="flex gap-1">
									{player.puzzleResults?.map(
										(status, idx) => (
											<Diamond
												key={idx}
												className={`w-4 h-4 ${
													status === 'win'
														? 'text-cyan-500'
														: 'text-gray-400'
												}`}
												fill={
													status === 'win'
														? '#06b6d4'
														: '#d1d5db'
												}
											/>
										),
									)}
								</div>
								<span className="font-bold">
									{player.score.toLocaleString()}
								</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}
