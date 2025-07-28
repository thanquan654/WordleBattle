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
import PlayerCard from '@/components/LobbyScreen/LobbyPlayerCard'
import EmptyPlayerCard from '@/components/EmptyPlayerCard'
import HelpModal from '@/components/HowToPlayModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	resetRoom,
	setBotId,
	setCurrentPlayerId,
	setGameRules,
	setPlayers,
	setRoomId,
	selectSortedPlayers,
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
import AppBackground from '@/components/AppBackground'
import MainPagePanel from '@/components/MainPagePanel'
import ReadyButton from '@/components/LobbyScreen/ReadyButton'
import LobbySetting from '@/components/LobbyScreen/LobbySetting'
import LobbyPlayers from '@/components/LobbyScreen/LobbyPlayers'

export default function LobbyScreen() {
	const currentPlayerId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const roomId = useParams().roomId
	const players = useSelector((state: RootState) =>
		selectSortedPlayers(state),
	)

	console.log('🚀 ~ players:', players)

	const gameSetting = useSelector((state: RootState) => state.room.gameRules)
	const maxPlayers = useSelector((state: RootState) => state.room.maxPlayers)
	const botId = useSelector((state: RootState) => state.room.botId)

	const [showHelp, setShowHelp] = useState(false)

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
		<AppBackground className=" px-4 pt-4">
			{/* Animated background elements */}
			<AnimatedBackground variant="character" />
			<HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

			<MainPagePanel className="">
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
						gameSetting={gameSetting}
						currentPlayerId={currentPlayerId}
						handleChangeSettings={handleChangeSettings}
						handleChangeState={handleChangeState}
						botId={botId}
					/>

					<ReadyButton
						players={players}
						currentPlayerId={currentPlayerId}
						handleChangeState={handleChangeState}
						handleStartGame={handleStartGame}
						allPlayersReady={allPlayersReady}
					/>
				</div>
			</MainPagePanel>
		</AppBackground>
	)
}
