function calculateWordleFeedback(guessWord, secretWord, wordLength) {
	if (guessWord.length !== wordLength || secretWord.length !== wordLength) {
		return Array(wordLength).fill('error')
	}

	const feedback = Array(wordLength).fill('absent')
	const secretWordLetters = secretWord.split('')
	const guessWordLetters = guessWord.split('')
	for (let i = 0; i < wordLength; i++) {
		if (guessWordLetters[i] === secretWordLetters[i]) {
			feedback[i] = 'correct'
			secretWordLetters[i] = null
		}
	}
	for (let i = 0; i < wordLength; i++) {
		if (feedback[i] !== 'correct') {
			for (let j = 0; j < wordLength; j++) {
				if (
					guessWordLetters[i] === secretWordLetters[j] &&
					secretWordLetters[j] !== null
				) {
					feedback[i] = 'present'
					secretWordLetters[j] = null
					break
				}
			}
		}
	}
	return feedback
}

function filterPossibleWords(wordList, guesses, wordLength) {
	let possibleWords = [...wordList]
	for (const { guessWord, feedback } of guesses) {
		if (guessWord.length !== wordLength || feedback.length !== wordLength)
			continue
		possibleWords = possibleWords.filter((potentialWord) => {
			if (potentialWord.length !== wordLength) return false
			const guessLetters = guessWord.split('')
			const potentialLetters = potentialWord.split('')
			const tempSecretLetters = potentialWord.split('')
			for (let i = 0; i < wordLength; i++) {
				if (feedback[i] === 'correct') {
					if (potentialLetters[i] !== guessLetters[i]) return false
					tempSecretLetters[i] = null
				}
			}
			for (let i = 0; i < wordLength; i++) {
				const guessLetter = guessLetters[i]
				const currentFeedback = feedback[i]
				if (currentFeedback === 'present') {
					if (potentialLetters[i] === guessLetter) return false
					const presentIndex = tempSecretLetters.indexOf(guessLetter)
					if (presentIndex === -1) return false
					tempSecretLetters[presentIndex] = null
				} else if (currentFeedback === 'absent') {
					let isUsedElsewhere = false
					for (let k = 0; k < wordLength; k++) {
						if (
							guessLetters[k] === guessLetter &&
							(feedback[k] === 'correct' ||
								feedback[k] === 'present')
						) {
							isUsedElsewhere = true
							break
						}
					}
					if (!isUsedElsewhere) {
						if (tempSecretLetters.includes(guessLetter))
							return false
					} else {
						if (potentialLetters[i] === guessLetter) return false
					}
				}
			}
			return true
		})
	}
	return possibleWords
}

function calculateEntropy(potentialGuessWord, possibleWords, wordLength) {
	if (potentialGuessWord.length !== wordLength) return -1
	if (!possibleWords || possibleWords.length <= 1) return 0

	const feedbackCounts = {}
	const totalPossible = possibleWords.length

	for (const secretWord of possibleWords) {
		if (secretWord.length !== wordLength) continue
		const feedback = calculateWordleFeedback(
			potentialGuessWord,
			secretWord,
			wordLength,
		)
		const feedbackKey = feedback.join(',')
		feedbackCounts[feedbackKey] = (feedbackCounts[feedbackKey] || 0) + 1
	}

	let entropy = 0
	for (const key in feedbackCounts) {
		const probability = feedbackCounts[key] / totalPossible
		if (probability > 0) {
			entropy -= probability * Math.log2(probability)
		}
	}
	return entropy
}

/**
 * Tìm từ đoán tiếp theo tốt nhất dựa trên thuật toán Entropy.
 * @param {Set<string>} fullWordSet - Set chứa tất cả các từ hợp lệ CHO ĐỘ DÀI NÀY.
 * @param {object[]} guesses - Mảng các lượt đoán trước đó { guessWord: string, feedback: string[] }.
 * @param {number} wordLength - Độ dài của từ cần tìm.
 * @returns {string|null} Từ đoán tốt nhất, hoặc null nếu có lỗi hoặc không còn từ nào.
 */
function findBestGuessWithEntropy(fullWordSet, guesses, wordLength) {
	if (guesses.length === 0) {
		switch (wordLength) {
			case 3:
				return 'EAS'
			case 4:
				return 'TALE'
			case 5:
				return 'RAISE'
			case 6:
				return 'SATIRE'
		}
	}

	console.log(`\nBắt đầu tìm từ đoán tốt nhất cho độ dài ${wordLength}...`)

	if (!fullWordSet || fullWordSet.size === 0) {
		console.error(
			`Lỗi: Set từ cho độ dài ${wordLength} rỗng hoặc không hợp lệ.`,
		)
		return null
	}

	const fullWordListArray = Array.from(fullWordSet)

	console.log('Bắt đầu lọc từ có thể...')
	const possibleWords = filterPossibleWords(
		fullWordListArray,
		guesses,
		wordLength,
	)
	console.log(
		`Số từ có thể còn lại (độ dài ${wordLength}): ${possibleWords.length}`,
	)

	if (possibleWords.length < 10) {
		console.log('Possible words: ', possibleWords)
	}

	if (possibleWords.length === 0) {
		console.error('Lỗi: Không còn từ nào có thể đúng.')
		return null
	}
	if (possibleWords.length === 1) {
		console.log('Chỉ còn 1 từ có thể, đó là đáp án!')
		return possibleWords[0]
	}

	// Nếu còn rất ít từ, trả về ngẫu nhiên một từ trong possibleWords
	if (possibleWords.length <= 5) {
		const randomIdx = Math.floor(Math.random() * possibleWords.length)
		const guessWord = possibleWords[randomIdx]

		console.log(`Từ ngẫu nhiên: ${guessWord}`)
		return guessWord
	}

	let bestGuess = null
	let maxEntropy = -1

	const candidateGuessWords = fullWordListArray

	console.log(
		`Bắt đầu tính Entropy cho ${candidateGuessWords.length} từ đoán tiềm năng (độ dài ${wordLength})...`,
	)
	const startTime = Date.now()

	for (const potentialGuess of candidateGuessWords) {
		const entropy = calculateEntropy(
			potentialGuess,
			possibleWords,
			wordLength,
		)

		if (entropy > maxEntropy) {
			maxEntropy = entropy
			bestGuess = potentialGuess
		}
	}
	const totalTime = (Date.now() - startTime) / 1000
	console.log(
		`Hoàn tất tính Entropy cho độ dài ${wordLength}. Thời gian: ${totalTime.toFixed(
			1,
		)}s`,
	)
	console.log(
		`Từ đoán tốt nhất (độ dài ${wordLength}): ${bestGuess} (Max Entropy: ${maxEntropy.toFixed(
			4,
		)})`,
	)

	return bestGuess
}

export { findBestGuessWithEntropy }
