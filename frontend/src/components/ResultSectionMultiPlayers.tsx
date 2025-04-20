import { motion } from 'framer-motion'
import { Star, ArrowRight, Award, Crown, Medal, Diamond } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function ResultSectionMultiPlayers({ players, topPlayers }) {
	const navigate = useNavigate()

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
		<>
			{/* Podium section */}
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
										topPlayers[1]?.avatar ||
										'/placeholder.svg'
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
							<div className="text-gray-600 text-xs">
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
										topPlayers[0]?.avatar ||
										'/placeholder.svg'
									}
									alt={topPlayers[0]?.name}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
						<div className="text-center mt-2">
							<div className="font-bold">
								{topPlayers[0]?.name}
							</div>
							<div className="text-gray-700">
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
										topPlayers[2]?.avatar ||
										'/placeholder.svg'
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
							<div className="text-gray-600 text-xs">
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

			{/* Full leaderboard */}
			<div className="px-6 py-4">
				<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<Star className="w-5 h-5 text-yellow-500" />
					<span>BXH tổng</span>
				</h2>

				<div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden mb-6">
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
												player.avatar ||
												'/placeholder.svg'
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
									<span>{player.score.toLocaleString()}</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

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

				{/* <motion.button
					className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleLeaveRoom}
				>
					<span>Rời phòng</span>
					<LogOut className="w-5 h-5" />
				</motion.button> */}
			</div>
		</>
	)
}
