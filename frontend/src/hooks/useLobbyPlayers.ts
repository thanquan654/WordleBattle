import { getRoomInfo, joinARoom, leaveARoom } from '@/apis/apiService'
import { socket } from '@/lib/socket'
import {
	resetRoom,
	setBotId,
	setCurrentPlayerId,
	setGameRules,
	setPlayers,
	setRoomId,
} from '@/store/RoomSlice'
import { IPlayer } from '@/types/type'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

export const useLobbyPlayers = (roomId: string) => {
	const dispatch = useDispatch()
	const navigator = useNavigate()

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
	}, [dispatch, roomId])

	const handleLeaveRoom = async (currentPlayerId: string) => {
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

	const handleAddOrRemoveBot = async (botId: string) => {
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
	return {
		handleLeaveRoom,
		handleAddOrRemoveBot,
	}
}
