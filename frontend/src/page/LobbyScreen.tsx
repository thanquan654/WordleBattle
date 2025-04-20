import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	HelpCircle,
	Check,
	Clock,
	Settings,
	Users,
	HelpingHand,
	Bot,
	Repeat,
	BotOff,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router'
import AnimatedBackground from '@/components/AnimatedBackground'
import GameHeader from '@/components/GameHeader'
import PlayerCard from '@/components/PlayerCard'
import EmptyPlayerCard from '@/components/EmptyPlayerCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	resetRoom,
	setBotId,
	setCurrentPlayerId,
	setGameRules,
	setGameState,
	setPlayers,
	setRoomId,
} from '@/store/RoomSlice'
import {
	changeRoomRules,
	changeState,
	getRoomInfo,
	joinARoom,
	leaveARoom,
	startGame,
} from '@/apis/apiService'
import { v4 as uuidv4 } from 'uuid'
import { socket } from '@/lib/socket'
import { IGameResponseWebsocket, IPlayer } from '@/types/type'
import { setInGameState } from '@/store/GameSlice'

export default function LobbyScreen() {
	const currentPlayerId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const roomId = useParams().roomId
	const players = useSelector((state: RootState) => state.room.players)
	const gameSetting = useSelector((state: RootState) => state.room.gameRules)
	const maxPlayers = useSelector((state: RootState) => state.room.maxPlayers)
	const botId = useSelector((state: RootState) => state.room.botId)

	const [gameStarted, setGameStarted] = useState(false)

	// Check if all players are ready
	const allPlayersReady = players.every(
		(player) =>
			player.state === 'ready' ||
			(player.state === 'owner' && player.playerId === currentPlayerId) ||
			player.state === 'bot',
	)

	const dispatch = useDispatch()
	const navigator = useNavigate()

	useEffect(() => {
		socket.on('connect', () => {
			console.log(`user connected ${socket.id}`)
		})
		socket.emit('subcribeRoom', roomId as string) // Đảm bảo tên event đúng với backend
		return () => {
			socket.off('connect')
		}
	}, [roomId])

	useEffect(() => {
		socket.on('updateRoom', (players: IPlayer[]) => {
			console.log('🚀 ~ Update players:', players)

			dispatch(setPlayers(players))
		})

		socket.on('joinRoom', (player: IPlayer[]) => {
			console.log('🚀 ~ New player:', player)
		})

		socket.on('leaveRoom', (playerId: string) => {
			console.log('🚀 ~ Leave player:', playerId)
		})

		socket.on('updateRoomRules', (roomRules: typeof gameSetting) => {
			dispatch(setGameRules(roomRules))
		})

		socket.on('startGame', (gameRespone: IGameResponseWebsocket) => {
			console.log('🚀 ~ gameRespone:', gameRespone)
			dispatch(setInGameState(gameRespone as IGameResponseWebsocket))

			navigator(`/game/${gameRespone.gameId}`, {
				state: gameSetting,
			})
		})

		return () => {
			socket.off('updateRoom')
			socket.off('joinRoom')
			socket.off('leaveRoom')
			socket.off('updateRoomRules')
			socket.off('startGame')
		}
	}, [dispatch, gameSetting, navigator])

	useEffect(() => {
		getRoomInfo(roomId as string).then((respone) => {
			dispatch(setCurrentPlayerId(localStorage.getItem('userId')))
			dispatch(setRoomId(respone?.data.roomId))
			dispatch(setPlayers(respone?.data.players))
			// Lấy gameRules từ backend
			if (respone?.data.gameRules) {
				dispatch(setGameRules(respone?.data.gameRules))
			}
			// Check room has bot
			if (
				respone?.data.players.find(
					(player: IPlayer) => player.state === 'bot',
				)
			) {
				dispatch(
					setBotId(
						respone?.data.players.find(
							(player: IPlayer) => player.state === 'bot',
						)?.playerId,
					),
				)
			}
		})
	}, [roomId, dispatch])

	const handleChangeSettings = (settings: typeof gameSetting) => {
		changeRoomRules(roomId as string, settings) // settings là gameRules
	}

	const handleLeaveRoom = async () => {
		const respone = await leaveARoom(
			roomId as string,
			currentPlayerId as string,
		)
		if (respone?.status === 200) {
			socket.emit('leaveRoom', roomId as string)

			dispatch(resetRoom())
			navigator('/')
		}
	}

	const handleAddOrRemoveBot = async () => {
		const currentBotId = botId ?? uuidv4()
		if (botId) {
			const respone = await leaveARoom(roomId as string, currentBotId)

			if (respone?.status === 200) {
				dispatch(setBotId(null))
			}
		} else {
			const respone = await joinARoom(roomId as string, {
				id: currentBotId,
				name: 'Daisy',
				isBot: true,
			})

			if (respone?.status === 200) {
				dispatch(setBotId(currentBotId))
			}
		}
	}

	const handleChangeState = async (state: string) => {
		await changeState(roomId as string, currentPlayerId as string, state)
	}

	const handleStartGame = async () => {
		await startGame(roomId as string)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 pt-4">
			{/* Animated background elements */}
			<AnimatedBackground variant="character" />

			<motion.div
				className="bg-white/10 backdrop-blur-sm rounded-t-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
				initial={{ opacity: 0, y: 1000 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* Header */}
				<GameHeader>
					<button
						className="p-2 rounded-full hover:bg-white/20 transition"
						onClick={() => {
							handleLeaveRoom()
						}}
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
					{/* TODO: Implement help */}
					<button className="p-2 rounded-full hover:bg-white/20 transition">
						<HelpCircle className="w-5 h-5" />
					</button>
				</GameHeader>

				{/* Main content */}
				<div className="p-6">
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
									onClick={handleAddOrRemoveBot}
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
									<PlayerCard
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

					{/* Settings section (only available for room owner) */}
					<motion.div
						className="bg-white/10 rounded-xl p-4 mb-6 relative"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						{players.find((p) => p.playerId === currentPlayerId)
							?.state !== 'owner' && (
							<div className="absolute inset-0 z-10 rounded-xl bg-gray-400 opacity-70"></div>
						)}
						<div className="flex items-center space-x-2 mb-4">
							<Settings className="w-5 h-5 text-indigo-600" />
							<h3 className="font-semibold text-white">
								Cài đặt phòng
							</h3>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white ">
							{/* Number of rounds */}
							<div className="space-y-2 ">
								<label className="text-sm text-gray-300 flex items-center space-x-2">
									<Repeat className="w-4 h-4 text-gray-500" />
									<span>Số vòng đấu</span>
								</label>
								<Select
									value={gameSetting.gameRound}
									onValueChange={(value) =>
										handleChangeSettings({
											...gameSetting,
											gameRound: value,
										})
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn số vòng" />
									</SelectTrigger>
									<SelectContent className="bg-gray-300">
										<SelectItem value="3">
											3 vòng
										</SelectItem>
										<SelectItem value="4">
											4 vòng
										</SelectItem>
										<SelectItem value="5">
											5 vòng
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Turn time */}
							<div className="space-y-2">
								<label className="text-sm text-gray-300 flex items-center space-x-2">
									<Clock className="w-4 h-4 text-gray-500" />
									<span>Thời gian mỗi lượt</span>
								</label>
								<Select
									value={gameSetting.roundTime}
									onValueChange={(value) =>
										handleChangeSettings({
											...gameSetting,
											roundTime: value,
										})
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn thời gian" />
									</SelectTrigger>
									<SelectContent className="bg-gray-300">
										<SelectItem value="90">
											90 giây
										</SelectItem>
										<SelectItem value="120" defaultChecked>
											120 giây
										</SelectItem>
										<SelectItem value="150">
											150 giây
										</SelectItem>
										<SelectItem value="180">
											180 giây
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* BOT guess */}
							<div className="flex justify-between flex-col space-y-1">
								<label className="text-sm text-gray-300 flex items-center space-x-2">
									<Clock className="w-4 h-4 text-gray-500" />
									<span>Độ khó của BOT</span>
								</label>
								<Select
									value={gameSetting.botDifficult}
									onValueChange={(value) =>
										handleChangeSettings({
											...gameSetting,
											botDifficult: value,
										})
									}
									disabled={!botId}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn thời gian" />
									</SelectTrigger>
									<SelectContent className="bg-gray-300">
										<SelectItem value="20">
											(Dễ) 20 giây
										</SelectItem>
										<SelectItem value="12" defaultChecked>
											(Trung Bình) 12 giây
										</SelectItem>
										<SelectItem value="8">
											(Khó) 8 giây
										</SelectItem>
										<SelectItem value="5">
											(Siêu khó) 5 giây
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Use BOT hints */}
							<div className="flex items-center justify-between">
								<label className="text-sm text-gray-300 flex items-center space-x-2">
									<HelpingHand className="w-4 h-4 text-gray-500" />
									<span>Sử dụng BOT hỗ trợ</span>
								</label>
								<Switch
									checked={gameSetting.isBotHelper}
									onCheckedChange={(checked) =>
										handleChangeSettings({
											...gameSetting,
											isBotHelper: checked,
										})
									}
									className="dark"
								/>
							</div>
						</div>
					</motion.div>

					{/* Ready button */}
					{players.find(
						(player) => player.playerId === currentPlayerId,
					)?.state === 'owner' ? (
						// Owner ready button
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
									Hãy đợi tất cả người chơi trong phòng sẵn
									sàng ...
								</span>
							)}
						</motion.button>
					) : (
						<motion.button
							className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center space-x-2 transition-all ${
								players.find(
									(player) =>
										player.playerId === currentPlayerId,
								)?.state === 'ready'
									? 'bg-emerald-500 hover:bg-emerald-600'
									: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/30 '
							} ${allPlayersReady ? 'animate-pulse' : ''}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() =>
								handleChangeState(
									players.find(
										(player) =>
											player.playerId === currentPlayerId,
									)?.state === 'ready'
										? 'waiting'
										: 'ready',
								)
							}
						>
							{players.find(
								(player) => player.playerId === currentPlayerId,
							)?.state === 'ready' ? (
								<>
									<Check className="w-5 h-5" />
									<span>Đã sẵn sàng</span>
								</>
							) : (
								<span>Sẵn sàng</span>
							)}
						</motion.button>
					)}
				</div>
			</motion.div>
		</div>
	)
}
