import { changeRoomRules, changeState, startGame } from '@/apis/apiService'
import React from 'react'

export const useLobbyAction = (roomId: string) => {
	const handleChangeSettings = async (settings: any) => {
		await changeRoomRules(roomId as string, settings) // settings là gameRules
	}
	const handleChangeState = async (
		currentPlayerId: string,
		state: string,
	) => {
		await changeState(roomId as string, currentPlayerId as string, state)
	}

	const handleStartGame = async () => {
		await startGame(roomId as string)
	}

	return {
		handleChangeSettings,
		handleChangeState,
		handleStartGame,
	}
}
