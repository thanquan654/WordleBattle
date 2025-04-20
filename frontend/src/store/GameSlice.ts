import {
	Puzzle,
	PlayersInGame,
	IGameResponseWebsocket,
	PlayerPuzzleData,
} from '@/types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GameState {
	gameId: string | null
	gameState: 'in_game' | 'finished'
	currentPuzzleIndex: number
	puzzles: Puzzle[]
	playersInGame: PlayersInGame[]
}

const initialState: GameState = {
	gameId: null,
	gameState: 'in_game',
	currentPuzzleIndex: 0,
	puzzles: [] as Puzzle[],
	playersInGame: [] as PlayersInGame[],
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setInGameState: (
			state: GameState,
			action: PayloadAction<IGameResponseWebsocket>,
		) => {
			state.gameId = action.payload.gameId
			state.gameState = action.payload.gameState
			state.currentPuzzleIndex = action.payload.currentPuzzleIndex
			state.puzzles = action.payload.puzzles
			state.playersInGame = action.payload.playersInGame
		},
		updatePuzzleState: (
			state: GameState,
			action: PayloadAction<{
				puzzleIndex: number
				playerPuzzleData: PlayerPuzzleData[]
				puzzleStatus: string
				currentPuzzleIndex: number
				gameState: string
			}>,
		) => {
			const {
				puzzleIndex,
				playerPuzzleData,
				puzzleStatus,
				currentPuzzleIndex,
				gameState,
			} = action.payload
			if (state.puzzles[puzzleIndex]) {
				state.puzzles[puzzleIndex].playerPuzzleData = playerPuzzleData
				state.puzzles[puzzleIndex].puzzleStatus = puzzleStatus
			}
			state.currentPuzzleIndex = currentPuzzleIndex
			state.gameState = gameState as 'in_game' | 'finished'
		},
		setCurrentPuzzleIndex: (
			state: GameState,
			action: PayloadAction<number>,
		) => {
			state.currentPuzzleIndex = action.payload
		},
		setGameFinished: (
			state: GameState,
			action: PayloadAction<IGameResponseWebsocket>,
		) => {
			state.gameState = 'finished'
			state.puzzles = action.payload.puzzles
			state.playersInGame = action.payload.playersInGame
		},
		setPlayerInGame: (state, action: PayloadAction<PlayersInGame[]>) => {
			state.playersInGame = action.payload
		},
	},
})

export const {
	setInGameState,
	updatePuzzleState,
	setCurrentPuzzleIndex,
	setGameFinished,
	setPlayerInGame,
} = gameSlice.actions

export default gameSlice.reducer
