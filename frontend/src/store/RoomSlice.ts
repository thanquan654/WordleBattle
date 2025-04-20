import { IPlayer, IRoomRules } from '@/types/type'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store' // hoặc đường dẫn tới file store của bạn

interface RoomState {
	currentPlayerId: string | null
	roomId: string | null
	players: IPlayer[]
	maxPlayers: number
	botId: string | null
	gameState: 'waiting' | 'playing' | 'finished'
	gameRules: IRoomRules
}

const initialState: RoomState = {
	currentPlayerId: localStorage.getItem('playerId') ?? null,
	roomId: null,
	players: [],
	maxPlayers: 20,
	gameState: 'waiting',
	botId: null,
	gameRules: {
		gameRound: '5',
		roundTime: '120',
		botDifficult: '12',
		isBotHelper: false,
	},
}

export const counterSlice = createSlice({
	name: 'room',
	initialState,
	reducers: {
		setCurrentPlayerId: (state, action: PayloadAction<string | null>) => {
			state.currentPlayerId = action.payload
		},
		setRoomId: (state, action: PayloadAction<string | null>) => {
			state.roomId = action.payload
		},
		setPlayers: (state, action: PayloadAction<IPlayer[]>) => {
			state.players = action.payload
		},
		setReadyState: (
			state,
			action: PayloadAction<{
				playerId: string
				state: 'ready' | 'waiting'
			}>,
		) => {
			state.players = [
				...state.players.map((player) => {
					if (player.playerId === action.payload.playerId) {
						return {
							...player,
							state: action.payload.state,
						}
					}
					return player
				}),
			]
		},
		setBotId: (state, action: PayloadAction<string | null>) => {
			state.botId = action.payload
		},
		addPlayer: (state, action: PayloadAction<IPlayer>) => {
			state.players.push(action.payload)
		},

		removePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
			state.players = state.players.filter(
				(player) => player.playerId !== action.payload.playerId,
			)
		},
		setGameState: (
			state,
			action: PayloadAction<{
				gameState: 'waiting' | 'playing' | 'finished'
			}>,
		) => {
			state.gameState = action.payload.gameState
		},
		setGameRules: (
			state,
			action: PayloadAction<{
				gameRound: string
				roundTime: string
				botDifficult: string
				isBotHelper: boolean
			}>,
		) => {
			state.gameRules = action.payload
		},
		resetRoom: () => initialState,
	},
})

// Selector sắp xếp lại danh sách players
export const selectSortedPlayers = (state: RootState) => {
	const roomState = state.room // hoặc tên slice bạn đặt trong combineReducers
	const owner = roomState.players.find((p) => p.state === 'owner')
	const bot = roomState.players.find((p) => p.state === 'bot')
	const current =
		roomState.currentPlayerId &&
		roomState.players.find(
			(p) =>
				p.playerId === roomState.currentPlayerId &&
				p.state !== 'owner' &&
				p.state !== 'bot',
		)
	const others = roomState.players.filter(
		(p) =>
			p !== owner &&
			p !== bot &&
			(!current || p.playerId !== current.playerId),
	)
	const sorted = [
		...(owner ? [owner] : []),
		...(bot ? [bot] : []),
		...(current ? [current] : []),
		...others,
	]
	return sorted
}

export const {
	setCurrentPlayerId,
	setRoomId,
	setPlayers,
	addPlayer,
	removePlayer,
	setGameState,
	setReadyState,
	resetRoom,
	setGameRules,
	setBotId,
} = counterSlice.actions

export default counterSlice.reducer
