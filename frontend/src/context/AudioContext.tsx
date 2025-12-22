import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	ReactNode,
} from 'react'
import { Howl, Howler } from 'howler'

type SoundMap = Record<string, Howl>

const soundSources: Record<string, string> = {
	// BGM
	bgm_result: '/audios/bgm_result.mp3',

	// SFX
	type_letter: '/audios/type_letter.wav',
	solve_secret_word: '/audios/solve_secret_word.mp3',
	wrong_secret_word: '/audios/wrong_secret_word.mp3',
	click: '/audios/click.wav',
}

interface AudioContextType {
	playSFX: (name: string) => void
	playBGM: (name: string) => void
	stopBGM: () => void
	isUnlocked: boolean
}

const AudioContext = createContext<AudioContextType | null>(null)

export const AudioProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isUnlocked, setUnlocked] = useState(false)
	const sounds = useRef<SoundMap>({})
	const currentBGM = useRef<Howl | null>(null)
	const currentBGMName = useRef<string | null>(null)
	const pendingBGM = useRef<string | null>(null)

	// Unlock AudioContext on interaction
	useEffect(() => {
		const unlock = () => {
			if (!sounds.current['__dummy__']) {
				sounds.current['__dummy__'] = new Howl({
					src: ['/audios/click.wav'], // Use an existing file to avoid errors
					volume: 0,
					preload: false,
				})
			}
			if (Howler.ctx && Howler.ctx.state !== 'running') {
				Howler.ctx.resume().then(() => {
					setUnlocked(true)
				})
			} else {
				setUnlocked(true)
			}
		}

		document.addEventListener('click', unlock, { once: true })
		document.addEventListener('keydown', unlock, { once: true })
		document.addEventListener('touchstart', unlock, { once: true })

		return () => {
			document.removeEventListener('click', unlock)
			document.removeEventListener('keydown', unlock)
			document.removeEventListener('touchstart', unlock)
		}
	}, [])

	// Load sounds when unlocked
	useEffect(() => {
		if (!isUnlocked) return
		for (const [key, src] of Object.entries(soundSources)) {
			// Avoid reloading if already exists
			if (!sounds.current[key]) {
				sounds.current[key] = new Howl({
					src: [src],
					volume: key.startsWith('bgm_') ? 0.3 : 0.8,
					loop: key.startsWith('bgm_'),
					preload: true,
				})
			}
		}
	}, [isUnlocked])

	const playSFX = useCallback(
		(name: string) => {
			if (!isUnlocked) return
			const sound = sounds.current[name]
			if (sound) {
				sound.play()
			} else {
				console.warn(`SFX not found: ${name}`)
			}
		},
		[isUnlocked],
	)

	const playBGM = useCallback(
		(name: string) => {
			if (!isUnlocked) {
				pendingBGM.current = name
				return
			}
			const sound = sounds.current[name]
			if (!sound) {
				console.warn(`BGM not found: ${name}`)
				return
			}

			// If already playing the same track, do nothing
			if (
				currentBGM.current === sound &&
				currentBGM.current.playing() &&
				currentBGMName.current === name
			) {
				return
			}

			// Stop previous BGM
			if (currentBGM.current && currentBGM.current.playing()) {
				currentBGM.current.fade(currentBGM.current.volume(), 0, 500)
				currentBGM.current.once('fade', () => {
					this?.stop()
				})
			}

			currentBGM.current = sound
			currentBGMName.current = name
			sound.volume(0)
			sound.play()
			sound.fade(0, 0.3, 500) // Fade in
		},
		[isUnlocked],
	)

	const stopBGM = useCallback(() => {
		if (currentBGM.current && currentBGM.current.playing()) {
			currentBGM.current.fade(currentBGM.current.volume(), 0, 500)
			setTimeout(() => {
				currentBGM.current?.stop()
				currentBGM.current = null
				currentBGMName.current = null
			}, 500)
		}
		pendingBGM.current = null
	}, [])

	// Auto-play pending BGM
	useEffect(() => {
		if (isUnlocked && pendingBGM.current) {
			playBGM(pendingBGM.current)
			pendingBGM.current = null
		}
	}, [isUnlocked, playBGM])

	return (
		<AudioContext.Provider
			value={{ playSFX, playBGM, stopBGM, isUnlocked }}
		>
			{children}
		</AudioContext.Provider>
	)
}

export const useAudio = () => {
	const context = useContext(AudioContext)
	if (!context) {
		throw new Error('useAudio must be used within an AudioProvider')
	}
	return context
}
