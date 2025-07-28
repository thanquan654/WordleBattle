import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router'
import GameHeader from '@/components/GameHeader'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { selectSortedPlayers } from '@/store/RoomSlice'
// Hooks
import { useLobbySocket } from '@/hooks/useLobbySocket'
import { useLobbyAction } from '@/hooks/useLobbyAction'
import { useLobbyPlayers } from '@/hooks/useLobbyPlayers'
// UI Components
import { ArrowLeft, HelpCircle } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'
import HelpModal from '@/components/HowToPlayModal'
import AppBackground from '@/components/AppBackground'
import MainPagePanel from '@/components/MainPagePanel'
import ReadyButton from '@/components/LobbyScreen/ReadyButton'
import LobbySetting from '@/components/LobbyScreen/LobbySetting'
import LobbyPlayers from '@/components/LobbyScreen/LobbyPlayers'

export default function LobbyScreen() {
	// State
	const roomId = useParams().roomId
	const { currentPlayerId, players, gameSetting, botId, maxPlayers } =
		useSelector((state: RootState) => ({
			currentPlayerId: state.room.currentPlayerId,
			players: selectSortedPlayers(state),
			gameSetting: state.room.gameRules,
			botId: state.room.botId,
			maxPlayers: state.room.maxPlayers,
		}))

	const [showHelp, setShowHelp] = useState(false)

	// Hooks
	useLobbySocket(roomId as string, gameSetting)
	const { handleChangeSettings, handleChangeState, handleStartGame } =
		useLobbyAction(roomId as string)
	const { handleAddOrRemoveBot, handleLeaveRoom } = useLobbyPlayers(
		roomId as string,
	)

	return (
		<AppBackground className=" px-4 pt-4">
			{/* Animated background elements */}
			<AnimatedBackground variant="character" />
			<HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

			<MainPagePanel className="">
				{/* Header */}
				<GameHeader>
					<button
						className="p-2 rounded-full hover:bg-white/20 transition"
						onClick={() =>
							handleLeaveRoom(currentPlayerId as string)
						}
					>
						<ArrowLeft className="w-5 h-5" />
					</button>

					<div className="flex flex-col items-center">
						<div className="text-xs uppercase tracking-wider opacity-80">
							Mã phòng
						</div>
						<div className="flex items-center space-x-2">
							<span className="text-xl font-bold tracking-[0.3em]">
								{roomId}
							</span>
							<motion.div
								className="w-2 h-2 rounded-full bg-green-400"
								animate={{ opacity: [1, 0.5, 1] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							/>
						</div>
					</div>
					{/* Help button */}
					<button
						className="p-2 rounded-full hover:bg-white/20 transition"
						onClick={() => setShowHelp(true)}
					>
						<HelpCircle className="w-5 h-5" />
					</button>
				</GameHeader>

				{/* Main content */}
				<div className="p-6">
					<LobbyPlayers
						players={players}
						currentPlayerId={currentPlayerId}
						handleAddOrRemoveBot={handleAddOrRemoveBot}
						botId={botId}
						maxPlayers={maxPlayers}
					/>

					<LobbySetting
						players={players}
						currentPlayerId={currentPlayerId}
						gameSetting={gameSetting}
						handleChangeSettings={handleChangeSettings}
						botId={botId}
					/>

					<ReadyButton
						players={players}
						currentPlayerId={currentPlayerId}
						handleChangeState={handleChangeState}
						handleStartGame={handleStartGame}
					/>
				</div>
			</MainPagePanel>
		</AppBackground>
	)
}
