import EmptyPlayerCard from '@/components/LobbyScreen/EmptyPlayerCard'
import LobbyPlayerCard from '@/components/LobbyScreen/LobbyPlayerCard'
import { Button } from '@/components/ui/button'
import { Bot, BotOff, Users } from 'lucide-react'

export default function LobbyPlayers({
	players,
	currentPlayerId,
	handleAddOrRemoveBot,
	botId,
	maxPlayers,
}) {
	return (
		<>
			{/* Section title */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2">
					<Users className="w-5 h-5 text-indigo-600" />
					<h2 className="text-lg font-semibold text-white">
						Người chơi
					</h2>
				</div>
				<div className="flex gap-4 items-center">
					{players.find(
						(player) =>
							player.playerId === currentPlayerId &&
							player.state === 'owner',
					) && (
						<Button
							className="flex items-center space-x-2 bg-transparent border-[1px] border-indigo-600 hover:bg-white/10 cursor-pointer"
							onClick={() => handleAddOrRemoveBot(botId)}
						>
							{!botId ? (
								<>
									<Bot className="w-5 h-5 text-indigo-600" />
									<span>Thêm BOT</span>
								</>
							) : (
								<>
									<BotOff className="w-5 h-5 text-indigo-600" />
									<span>Xóa BOT</span>
								</>
							)}
						</Button>
					)}
					<div className="text-sm text-gray-300">
						{players.length}/{maxPlayers}
					</div>
				</div>
			</div>

			{/* Players grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
				{/* Render existing players */}
				{players.map((player, index) => {
					if (index < 6) {
						return (
							<LobbyPlayerCard
								key={player.playerId}
								name={player.playerName}
								status={player.state}
								avartar={player.avatar}
								isCurrentUser={
									player.playerId === currentPlayerId
								}
							/>
						)
					} else {
						return <></>
					}
				})}

				{/* Empty slots */}
				{Array.from({
					length: 6 - players.length,
				}).map((_, index) => (
					<EmptyPlayerCard key={`empty-${index}`} />
				))}
			</div>
		</>
	)
}
