import fs from 'fs/promises'
import wordDictionaries from './dictionary.js'
import { findBestGuessWithEntropy } from './botHint.js'

const getRandomSecretWord = () => {
	const dictionaryEntries = Object.entries(wordDictionaries)

	// Chọn ngẫu nhiên một từ điển từ danh sách có từ
	const [key, dictionary] =
		dictionaryEntries[Math.floor(Math.random() * dictionaryEntries.length)]

	// Chuyển từ điển thành mảng để lấy từ ngẫu nhiên
	const wordsArray = Array.from(dictionary)
	const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]

	return randomWord
}

const makeWordList = async () => {
	try {
		const data = await fs.readFile('./wordsList.txt', 'utf8')
		const lines = data.split('\n')

		for (let line of lines) {
			const word = line.trim()
			if (word.length === 3) {
				wordDictionaries.threeWordDictionary.add(word)
			} else if (word.length === 4) {
				wordDictionaries.fourWordDictionary.add(word)
			} else if (word.length === 5) {
				wordDictionaries.fiveWordDictionary.add(word)
			} else if (word.length === 6) {
				wordDictionaries.sixWordDictionary.add(word)
			}
		}
	} catch (err) {
		console.error('Error reading file:', err)
	}
}

const checkWord = (guessWord, secretWord) => {
	const newBoard = new Array(secretWord.length).fill('absent')

	const letterCount = {}
	secretWord.split('').forEach((letter) => {
		letterCount[letter] = (letterCount[letter] || 0) + 1
	})

	// Check for correct positions first
	for (let i = 0; i < secretWord.length; i++) {
		const currentLetter = guessWord[i]
		if (currentLetter === secretWord[i]) {
			newBoard[i] = 'correct'
			letterCount[currentLetter]--
		}
	}

	// Then check for present but wrong position
	for (let i = 0; i < secretWord.length; i++) {
		const currentLetter = guessWord[i]
		if (newBoard[i] !== 'correct') {
			if (
				secretWord.includes(currentLetter) &&
				letterCount[currentLetter] > 0
			) {
				newBoard[i] = 'present'
				letterCount[currentLetter]--
			}
		}
	}

	return {
		guessWord: guessWord,
		feedback: newBoard,
	}
}
const checkWordInDictionary = (word) => {
	return (
		wordDictionaries.threeWordDictionary.has(word) ||
		wordDictionaries.fourWordDictionary.has(word) ||
		wordDictionaries.fiveWordDictionary.has(word) ||
		wordDictionaries.sixWordDictionary.has(word)
	)
}

// previousGuesses: { guessWord: string, feedback: string[] }
const hintPuzzle = (previousGuesses, wordLength) => {
	switch (wordLength) {
		case 3:
			return findBestGuessWithEntropy(
				wordDictionaries.threeWordDictionary,
				previousGuesses,
				wordLength,
			)
		case 4:
			return findBestGuessWithEntropy(
				wordDictionaries.fourWordDictionary,
				previousGuesses,
				wordLength,
			)
		case 5:
			return findBestGuessWithEntropy(
				wordDictionaries.fiveWordDictionary,
				previousGuesses,
				wordLength,
			)
		case 6:
			return findBestGuessWithEntropy(
				wordDictionaries.sixWordDictionary,
				previousGuesses,
				wordLength,
			)
		default:
			return null
	}
}

export {
	getRandomSecretWord,
	hintPuzzle,
	checkWord,
	makeWordList,
	checkWordInDictionary,
}
