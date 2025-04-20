interface IPlayer {
	playerId: string
	playerName: string
	state: 'owner' | 'bot' | 'waiting' | 'ready'
	avatar: string
}

interface IRoomRules {
	gameRound: string
	roundTime: string
	botDifficult: string
	isBotHelper: boolean
}

interface IGameResponseWebsocket {
	gameId: string
	roomId: string
	gameState: 'in_game' | 'finished'
	currentPuzzleIndex: number
	totalPuzzles: string
	puzzles: Puzzle[]
	playersInGame: PlayersInGame[]
	startTime: string
}

interface Puzzle {
	puzzleIndex: number
	puzzleStatus: string
	wordLength: number
	playerPuzzleData: PlayerPuzzleData[]
}

interface PlayerPuzzleData {
	playerId: string
	playerName: string
	guesses: PlayerGuess[]
	gameStatus: 'playing' | 'win' | 'lost'
	score: number
	timeRemain: number
}

interface PlayerGuess {
	guessWord: string
	feedback: string[]
}

interface PlayersInGame {
	playerId: string
	playerName: string
	totalScore: number
	rank: number
}

export type {
	IPlayer,
	IRoomRules,
	IGameResponseWebsocket,
	Puzzle,
	PlayerPuzzleData,
	PlayersInGame,
}
