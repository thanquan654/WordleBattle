import mongoose from 'mongoose'
const { Schema } = mongoose

const gameSchema = new Schema(
	{
		roomId: { type: String, required: true },
		gameState: {
			type: String,
			enum: ['in_game', 'finished'],
		},
		currentPuzzleIndex: { type: Number, default: 0 },
		totalPuzzles: { type: Number, default: 5 },
		puzzles: [
			{
				puzzleIndex: { type: Number, required: true },
				secretWord: { type: String, required: true },
				wordLength: { type: Number, required: true },
				puzzleStatus: {
					type: String,
					emum: ['pending', 'playing', 'finished'],
				},
				playerPuzzleData: [
					{
						playerId: { type: String },
						guesses: [
							// Các lượt đoán của người chơi cho câu đố này
							{
								guessWord: { type: String },
								feedback: [
									{
										type: String,
										enum: ['correct', 'present', 'absent'],
									},
								],
							},
						],
						gameStatus: {
							type: String,
							emum: ['playing', 'won', 'lost'],
						},
						score: { type: Number },
						timeRemain: { type: Number },
					},
					// ... more players data for this puzzle ...
				],
			},
			// ... more puzzles in this game ...
		],
		playersInGame: [
			// Mảng người chơi ở cấp game
			{
				playerId: { type: String },
				playerName: { type: String },
				totalScore: { type: Number, default: 0 },
				rank: { type: Number, default: 0 },
			},
			// ... more players in game ...
		],
		startTime: { type: Date },
		endTime: { type: Date },
	},
	{ timestamps: true },
)

export default mongoose.model('Game', gameSchema)
