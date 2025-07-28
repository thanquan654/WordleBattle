import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

export type PlayerResult = {
	id: string
	name: string
	avatar: string
	score: number
	rank: number
	isCurrentUser: boolean
	isBot: boolean
	puzzleResults: ('playing' | 'win' | 'lost')[]
}

export const useGameResult = () => {
	const currentUserId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const playersInGame = useSelector(
		(state: RootState) => state.game.playersInGame,
	)
	const roomPlayers = useSelector((state: RootState) => state.room.players)
	const gameSetting = useSelector((state: RootState) => state.room.gameRules)
	const gameData = useSelector((state: RootState) => state.game)

	const players: PlayerResult[] = playersInGame
		.map((p) => {
			const roomPlayer = roomPlayers.find(
				(rp) => rp.playerId === p.playerId,
			)
			// Lấy kết quả từng câu cho player này
			const puzzleResults = gameSetting.gameRound
				? Array.from({ length: Number(gameSetting.gameRound) }).map(
						(_, idx) => {
							const puzzle = gameData.puzzles[idx]
							const playerPuzzle = puzzle?.playerPuzzleData?.find(
								(pp) => pp.playerId === p.playerId,
							)
							return playerPuzzle?.gameStatus || 'lost'
						},
				  )
				: []

			return {
				id: p.playerId,
				name: p.playerName || roomPlayer?.playerName || 'Người chơi',
				avatar:
					roomPlayer?.avatar ||
					'https://cdn-icons-png.flaticon.com/256/5772/5772500.png',
				score: p.totalScore,
				rank: p.rank,
				isCurrentUser: p.playerId === currentUserId,
				isBot: roomPlayer?.state === 'bot',
				puzzleResults, // ['win', 'lost', ...]
			}
		})
		.sort((a, b) => a.rank - b.rank)

	const topPlayers = players.filter((player) => player.rank <= 3)

	return {
		players,
		topPlayers,
		totalRounds: gameSetting.gameRound,
	}
}
