import { IRoomRules } from '@/types/type'
import axios from './axiosInstance'

const getRoomInfo = async (roomId: string) => {
	try {
		const respone = await axios.get(`/room/${roomId}`)
		return respone
	} catch (err) {
		console.log(err)
	}
}

const createRoom = async (id: string, name: string) => {
	try {
		const respone = await axios.post(`/room`, {
			name,
			id,
		})
		return respone
	} catch (err) {
		console.log(err)
	}
}

const joinARoom = async (
	roomId: string,
	playerInfo: {
		id: string
		name: string
		isBot: boolean
	},
) => {
	try {
		const respone = await axios.post(`/room/${roomId}/join`, playerInfo)
		return respone
	} catch (err) {
		console.log(err)
	}
}

const leaveARoom = async (roomId: string, playerId: string) => {
	try {
		const respone = await axios.post(`/room/${roomId}/leave`, {
			id: playerId,
		})
		return respone
	} catch (error) {
		console.log(error)
	}
}

const getGameState = async (gameId: string) => {
	try {
		const respone = await axios.get(`/game/${gameId}/state`)
		return respone
	} catch (error) {
		console.log(error)
	}
}

const changeState = async (roomId: string, playerId: string, state: string) => {
	try {
		const respone = await axios.post(`/room/${roomId}/state`, {
			id: playerId,
			state,
		})
		return respone
	} catch (error) {
		console.log(error)
	}
}

const changeRoomRules = async (roomId: string, rules: IRoomRules) => {
	try {
		const respone = await axios.post(`/room/${roomId}/rules`, rules)

		return respone
	} catch (error) {
		console.log(error)
	}
}

const startGame = async (roomId: string) => {
	try {
		const respone = await axios.post(`/game/${roomId}/start`)

		return respone
	} catch (error) {
		console.log(error)
	}
}

const checkGuess = async (
	gameId: string,
	playerId: string,
	puzzleIndex: number,
	guess: string,
	currentTime: number,
) => {
	try {
		const respone = await axios.post(`/game/${gameId}/guess`, {
			playerId,
			gameId,
			puzzleIndex,
			guess,
			currentTime,
		})

		return respone
	} catch (error) {
		console.log(error)
	}
}

const completeAPuzzle = async (
	gameId: string,
	playerId: string,
	puzzleIndex: number,
	currentTime: number,
) => {
	try {
		const respone = await axios.post(`/game/${gameId}/complete`, {
			playerId,
			gameId,
			puzzleIndex,
			currentTime,
		})

		console.log('🚀 ~ respone:', respone)
		return respone
	} catch (error) {
		console.log(error)
	}
}

const getBotHint = async (
	gameId: string,
	previousGuesses: { guessWord: string; feedback: string[] }[],
	wordLength: number,
) => {
	try {
		const response = await axios.post(`/game/${gameId}/hint`, {
			previousGuesses,
			wordLength,
		})
		return response.data
	} catch (err) {
		console.error('Error getting bot hint:', err)
		return null
	}
}

export {
	getRoomInfo,
	createRoom,
	joinARoom,
	leaveARoom,
	getGameState,
	changeState,
	changeRoomRules,
	startGame,
	checkGuess,
	completeAPuzzle,
	getBotHint,
}
