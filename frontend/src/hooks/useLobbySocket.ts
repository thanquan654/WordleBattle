import { useEffect } from 'react'
import { socket } from '@/lib/socket'
import { setGameRules, setPlayers } from '@/store/RoomSlice'
import { useDispatch } from 'react-redux'
import { IGameResponseWebsocket, IPlayer, IRoomRules } from '@/types/type'
import { setInGameState } from '@/store/GameSlice'
import { useNavigate } from 'react-router'

export const useLobbySocket = (roomId: string, gameSetting: any) => {
	const dispatch = useDispatch()
	const navigator = useNavigate()

	useEffect(() => {
		socket.on('connect', () => {
			console.log(`user connected ${socket.id}`)
		})
		socket.emit('subcribeRoom', roomId as string)

		return () => {
			socket.off('connect')
		}
	}, [roomId])

	useEffect(() => {
		// Event handlers
		const handlers = {
			updateRoom: (players: IPlayer[]) => {
				console.log('🚀 ~ Update players:', players)
				dispatch(setPlayers(players))
			},
			joinRoom: (player: IPlayer[]) => {
				console.log('🚀 ~ New player:', player)
			},
			leaveRoom: (playerId: string) => {
				console.log('🚀 ~ Leave player:', playerId)
			},
			updateRoomRules: (roomRules: IRoomRules) => {
				dispatch(setGameRules(roomRules))
			},
			startGame: (gameResponse: IGameResponseWebsocket) => {
				console.log('🚀 ~ gameRespone:', gameResponse)
				dispatch(setInGameState(gameResponse))
				navigator(`/game/${gameResponse.gameId}`, {
					state: gameSetting,
				})
			},
		}

		// Register events
		Object.entries(handlers).forEach(([event, handler]) => {
			socket.on(event, handler)
		})

		// Cleanup events
		return () => {
			Object.entries(handlers).forEach(([event]) => {
				socket.off(event)
			})
		}
	}, [dispatch, gameSetting, navigator])
}
