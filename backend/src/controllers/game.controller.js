import Game from '../schemas/Game.schema.js'
import Room from '../schemas/Room.schema.js'
import axios from 'axios'
import {
	checkWord,
	getRandomSecretWord,
	checkWordInDictionary,
	hintPuzzle as getBotHint,
} from '../helpers/game.js'

const getCurrentGameState = async (req, res) => {
	const gameId = req.params.gameId
	try {
		const game = await Game.findOneById(gameId)

		res.status(200).json(game)
	} catch (err) {
		res.status(500).json(err)
	}
}

const startGame = async (req, res) => {
	try {
		const roomId = req.params.roomId

		const room = await Room.findOne({ roomId: roomId })

		if (!room) {
			res.status(404).json({ message: 'Khong tim thay phong' })
			return
		}
		room.gameState = 'playing'
		await room.save()

		const numberOfPuzzles = room.gameRules.gameRound

		const puzzles = Array.from({ length: numberOfPuzzles }, (_, index) => ({
			puzzleIndex: index,
			secretWord: getRandomSecretWord().toUpperCase(),
			puzzleStatus: index === 0 ? 'playing' : 'pending',
			playerPuzzleData: [
				...room.players.map((player) => ({
					playerId: player.playerId,
					guesses: [],
					gameStatus: 'playing',
					score: 0,
					timeRemain: room.gameRules.roundTime,
				})),
			],
		}))

		const newGame = new Game({
			roomId: roomId,
			gameState: 'in_game',
			currentPuzzleIndex: 0,
			totalPuzzles: numberOfPuzzles,
			puzzles: [
				...puzzles.map((puzzle) => ({
					...puzzle,
					wordLength: puzzle.secretWord.length,
				})),
			],
			playersInGame: room.players.map((player) => ({
				playerId: player.playerId,
				playerName: player.playerName,
				totalScore: 0,
				gameStatus: 'playing',
			})),
			startTime: new Date(),
		})

		await newGame.save()

		room.currentGameId = newGame._id
		await room.save()

		const gameResponse = {
			gameId: newGame._id,
			roomId: newGame.roomId,
			gameState: newGame.gameState,
			currentPuzzleIndex: newGame.currentPuzzleIndex,
			totalPuzzles: numberOfPuzzles,
			puzzles: newGame.puzzles.map((puzzle) => ({
				puzzleIndex: puzzle.puzzleIndex,
				puzzleStatus: puzzle.puzzleStatus,
				wordLength: puzzle.wordLength,
				playerPuzzleData: puzzle.playerPuzzleData,
			})),
			playersInGame: newGame.playersInGame.map((player) => ({
				playerId: player.playerId,
				playerName: player.playerName,
				gameStatus: player.gameStatus,
				totalScore: player.totalScore,
			})),
			startTime: newGame.startTime,
		}

		__io.to(roomId).emit('startGame', gameResponse)

		const bot = room.players.find((p) => p.state === 'bot')
		if (bot) {
			runBotForPuzzle(
				newGame._id,
				0,
				bot.playerId,
				Number(room.gameRules.roundTime), // ép kiểu ở đây
			)
		}

		res.status(200).json(gameResponse)
	} catch (err) {
		console.log(err)
		res.status(500).json(err)
	}
}

// guessPuzzle chỉ xử lý logic đoán từ và trả về kết quả cho client
const guessPuzzle = async (req, res) => {
	try {
		const gameId = req.params.gameId
		const { playerId, puzzleIndex, guess, currentTime } = req.body
		const game = await Game.findOne({ _id: gameId })

		if (!game) {
			return res.status(404).json({ message: 'Khong tim thay phong' })
		}

		const puzzle = game.puzzles[puzzleIndex]
		if (puzzle.puzzleStatus !== 'playing') {
			return res.status(400).json({ message: 'Puzzle chua bat dau' })
		}

		const isValidWord = checkWordInDictionary(guess)
		if (!isValidWord) {
			return res.status(205).json({ message: 'Tu khong hop le' })
		}

		const guessResult = checkWord(guess, puzzle.secretWord)

		// Cập nhật guesses bằng updateOne để tránh lỗi version
		await Game.updateOne(
			{
				_id: gameId,
				[`puzzles.${puzzleIndex}.playerPuzzleData.playerId`]: playerId,
			},
			{
				$push: {
					[`puzzles.${puzzleIndex}.playerPuzzleData.$.guesses`]:
						guessResult,
				},
				$set: {
					[`puzzles.${puzzleIndex}.playerPuzzleData.$.timeRemain`]:
						Number(currentTime),
				},
			},
		)

		// Nếu đoán đúng, cập nhật trạng thái win và điểm
		const isCorrect =
			guessResult.feedback &&
			guessResult.feedback.length > 0 &&
			guessResult.feedback.every((f) => f === 'correct')

		if (isCorrect) {
			const score = 5000 + 100 * Number(currentTime)
			await Game.updateOne(
				{
					_id: gameId,
					[`puzzles.${puzzleIndex}.playerPuzzleData.playerId`]:
						playerId,
				},
				{
					$set: {
						[`puzzles.${puzzleIndex}.playerPuzzleData.$.gameStatus`]:
							'win',
						[`puzzles.${puzzleIndex}.playerPuzzleData.$.score`]:
							score,
					},
				},
			)
			await Game.updateOne(
				{ _id: gameId, 'playersInGame.playerId': playerId },
				{
					$inc: { 'playersInGame.$.totalScore': score },
				},
			)
		}

		return res.status(200).json(guessResult)
	} catch (err) {
		console.log(err)
		res.status(500).json(err)
	}
}

// completeAPuzzle xử lý khi player hoàn thành puzzle (win hoặc hết giờ), kiểm tra round/game, emit sự kiện cho room
const completeAPuzzle = async (req, res) => {
	try {
		const gameId = req.params.gameId
		const { playerId, puzzleIndex, currentTime } = req.body
		const game = await Game.findOne({ _id: gameId })
		if (!game) {
			return res.status(404).json({ message: 'Khong tim thay phong' })
		}

		const puzzle = game.puzzles[puzzleIndex]
		if (!puzzle || puzzle.puzzleStatus !== 'playing') {
			return res
				.status(400)
				.json({ message: 'Puzzle đã kết thúc hoặc không tồn tại' })
		}

		const room = await Room.findOne({ roomId: game.roomId })

		const playerData = puzzle.playerPuzzleData.find(
			(p) => p.playerId === playerId,
		)
		playerData.timeRemain = Number(currentTime)

		const maxGuesses = puzzle.wordLength + 1

		// Nếu đã đoán hết số lần mà chưa đúng thì set lost và cộng điểm thời gian
		if (
			playerData.gameStatus === 'playing' &&
			playerData.guesses.length >= maxGuesses
		) {
			playerData.gameStatus = 'lost'
			const score = 0 + 100 * Number(currentTime) // chỉ cộng điểm thời gian
			playerData.score = score

			const playerInGame = game.playersInGame.find(
				(p) => p.playerId === playerId,
			)
			if (playerInGame) {
				playerInGame.totalScore += score
			}
		} else if (playerData.gameStatus === 'playing') {
			// Nếu gọi completeAPuzzle vì lý do khác (ví dụ hết giờ)
			playerData.gameStatus = currentTime > 0 ? 'win' : 'lost'
		}

		// Kiểm tra tất cả người chơi đã hoàn thành chưa
		const hasPlayerInPuzzle = puzzle.playerPuzzleData.every(
			(p) => p.gameStatus !== 'playing',
		)
		if (hasPlayerInPuzzle) {
			puzzle.puzzleStatus = 'completed'

			// Cập nhật rank cho từng player
			const sortedPlayers = [...game.playersInGame].sort(
				(a, b) => b.totalScore - a.totalScore,
			)
			sortedPlayers.forEach((player, idx) => {
				player.rank = idx + 1
			})
			game.playersInGame.forEach((player) => {
				const found = sortedPlayers.find(
					(p) => p.playerId === player.playerId,
				)
				if (found) player.rank = found.rank
			})

			if (game.currentPuzzleIndex + 1 < game.puzzles.length) {
				game.currentPuzzleIndex += 1
				game.puzzles[game.currentPuzzleIndex].puzzleStatus = 'playing'
				__io.to(gameId).emit('nextPuzzle', {
					currentPuzzleIndex: game.currentPuzzleIndex,
					playersInGame: game.playersInGame,
				})

				// GỌI BOT CHƠI Ở ĐÂY
				const bot = room.players.find((p) => p.state === 'bot')
				if (bot) {
					runBotForPuzzle(
						game._id,
						game.currentPuzzleIndex,
						bot.playerId,
						room.gameRules.roundTime,
					)
				}
			} else {
				game.gameState = 'finished'
				__io.to(gameId).emit('gameFinished', { game })
			}
		}

		await game.save()

		__io.to(gameId).emit('completeAPuzzle', {
			playerId,
			puzzleIndex,
			currentTime,
			playerPuzzleData: puzzle.playerPuzzleData,
			puzzleStatus: puzzle.puzzleStatus,
			currentPuzzleIndex: game.currentPuzzleIndex,
			gameState: game.gameState,
			playersInGame: game.playersInGame,
		})

		return res.status(200).json(game)
	} catch (err) {
		console.error(err)
		res.status(500).json(err)
	}
}

const hintPuzzle = async (req, res) => {
	try {
		const gameId = req.params.gameId
		const { previousGuesses, wordLength } = req.body

		if (!Array.isArray(previousGuesses) || typeof wordLength !== 'number') {
			return res.status(400).json({ message: 'Invalid input' })
		}

		const hint = getBotHint(previousGuesses, wordLength)
		return res.status(200).json({ hint })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Lỗi server', error: err })
	}
}

// Hàm cho BOT tự động chơi
const runBotForPuzzle = async (gameId, puzzleIndex, botPlayerId, roundTime) => {
	let done = false

	const game = await Game.findOne({ _id: gameId })
	const room = await Room.findOne({ roomId: game.roomId })
	const botDifficult = room?.gameRules?.botDifficult
	const delay = botDifficult ? Number(botDifficult) * 1000 : 12000

	let lastGuess = null

	while (!done) {
		const game = await Game.findOne({ _id: gameId })
		const puzzle = game.puzzles[puzzleIndex]
		const botData = puzzle.playerPuzzleData.find(
			(p) => p.playerId === botPlayerId,
		)
		if (!botData || botData.gameStatus !== 'playing') break

		const wordLength = puzzle.wordLength
		const maxGuesses = wordLength + 1

		// Nếu bot đã đoán đủ số lần thì dừng
		if ((botData.guesses?.length || 0) >= maxGuesses) break

		let timeRemain = Math.max(
			Number(roundTime) -
				((botData.guesses.length || 0) + 1) * Number(botDifficult),
			0,
		)

		if (isNaN(timeRemain)) timeRemain = 0

		const previousGuesses = botData.guesses || []

		const guess = getBotHint(previousGuesses, wordLength)
		if (!guess || guess === lastGuess) break
		lastGuess = guess

		try {
			const baseUrl =
				process.env.BACKEND_URL ||
				`http://localhost:${process.env.PORT || 3001}`
			await axios.post(
				`${baseUrl}/api/game/${gameId}/guess`,
				{
					playerId: botPlayerId,
					puzzleIndex,
					guess,
					currentTime: timeRemain,
				},
				{ timeout: 10000 },
			)
		} catch (err) {
			console.error('Bot guess API error:', err?.response?.data || err)
			break
		}

		// Lấy lại trạng thái mới nhất
		const updatedGame = await Game.findOne({ _id: gameId })
		const updatedBotData = updatedGame.puzzles[
			puzzleIndex
		].playerPuzzleData.find((p) => p.playerId === botPlayerId)

		if (
			!updatedBotData ||
			updatedBotData.gameStatus !== 'playing' ||
			(updatedBotData.guesses?.length || 0) >= maxGuesses
		) {
			done = true
		} else {
			await new Promise((res) => setTimeout(res, delay))
		}
	}

	const finalGame = await Game.findOne({ _id: gameId })
	const finalPuzzle = finalGame.puzzles[puzzleIndex]
	const finalBotData = finalPuzzle.playerPuzzleData.find(
		(p) => p.playerId === botPlayerId,
	)

	// Sau khi kết thúc vòng lặp, nếu bot vẫn chưa win/lost, gọi completeAPuzzle
	let timeRemain = Math.max(
		Number(roundTime) - finalBotData.guesses.length * Number(botDifficult),
		0,
	)

	if (isNaN(timeRemain)) timeRemain = 0

	if (finalBotData && finalPuzzle.puzzleStatus === 'playing') {
		try {
			const baseUrl =
				process.env.BACKEND_URL ||
				`http://localhost:${process.env.PORT || 3001}`
			await axios.post(
				`${baseUrl}/api/game/${gameId}/complete`,
				{
					playerId: botPlayerId,
					puzzleIndex,
					currentTime: timeRemain,
				},
				{ timeout: 5000 },
			)
		} catch (err) {
			console.error(
				'Bot completeAPuzzle API error:',
				err?.response?.data || err,
			)
		}
	}
}

export {
	getCurrentGameState,
	startGame,
	guessPuzzle,
	hintPuzzle,
	completeAPuzzle,
}
