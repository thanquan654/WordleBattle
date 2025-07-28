import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function ReadyButton({
	players,
	currentPlayerId,
	handleStartGame,
	handleChangeState,
}) {
	const playerState = players.find(
		(player) => player.playerId === currentPlayerId,
	)?.state

	// Check if all players are ready
	const allPlayersReady = players.every(
		(player) =>
			player.state === 'ready' ||
			(player.state === 'owner' && player.playerId === currentPlayerId) ||
			player.state === 'bot',
	)

	if (playerState === 'owner') {
		return (
			<motion.button
				className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center space-x-2 transition-all ${
					allPlayersReady
						? 'bg-emerald-500 hover:bg-emerald-600'
						: ' bg-white/10 text-white py-3 px-4 rounded-lg transition-all shadow-lg  '
				} ${allPlayersReady ? 'animate-pulse' : ''}`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={handleStartGame}
				disabled={!allPlayersReady}
			>
				{allPlayersReady ? (
					<>
						<Check className="w-5 h-5" />
						<span>Bắt đầu game</span>
					</>
				) : (
					<span>
						Hãy đợi tất cả người chơi trong phòng sẵn sàng ...
					</span>
				)}
			</motion.button>
		)
	} else {
		return (
			<motion.button
				className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center space-x-2 transition-all ${
					players.find(
						(player) => player.playerId === currentPlayerId,
					)?.state === 'ready'
						? 'bg-emerald-500 hover:bg-emerald-600'
						: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/30 '
				} ${allPlayersReady ? 'animate-pulse' : ''}`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={() =>
					handleChangeState(
						players.find(
							(player) => player.playerId === currentPlayerId,
						)?.state === 'ready'
							? 'waiting'
							: 'ready',
					)
				}
			>
				{players.find((player) => player.playerId === currentPlayerId)
					?.state === 'ready' ? (
					<>
						<Check className="w-5 h-5" />
						<span>Đã sẵn sàng</span>
					</>
				) : (
					<span>Sẵn sàng</span>
				)}
			</motion.button>
		)
	}
}
