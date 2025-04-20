import mongoose from 'mongoose'
const { Schema } = mongoose

const roomSchema = new Schema(
	{
		roomId: { type: String, required: true },
		players: [
			{
				playerId: { type: String },
				playerName: { type: String },
				state: {
					type: String,
					default: 'waiting',
					enum: ['owner', 'bot', 'waiting', 'ready'],
				},
				avatar: { type: String },
			},
		],
		gameState: {
			type: String,
			default: 'waiting',
			enum: ['waiting', 'playing', 'finished'],
		},
		currentGameId: {
			type: mongoose.Types.ObjectId || null,
			ref: 'Game',
			default: null,
		},
		gameRules: {
			// Đổi từ roomRules thành gameRules
			gameRound: { type: String, default: '5', enum: ['3', '4', '5'] },
			roundTime: {
				type: String,
				default: '120',
				enum: ['90', '120', '150', '180'],
			},
			botDifficult: {
				type: String,
				default: '70',
				enum: ['25', '45', '70', '90'],
			},
			isBotHelper: { type: Boolean, default: false },
		},
	},
	{ timestamps: true },
)

export default mongoose.model('Room', roomSchema)
