import { useCallback, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'

type SoundMap = Record<string, Howl>

const soundSources: Record<string, string> = {
	// BGM
	bgm_result: '/audios/bgm_result.mp3',

	// SFX
	type_letter: '/audios/type_letter.wav',
	solve_secret_word: '/audios/solve_secret_word.mp3',
	wrong_secret_word: '/audios/wrong_secret_word.mp3',
}

export function useAudioManager() {
	const [isUnlocked, setUnlocked] = useState(false)
	const sounds = useRef<SoundMap>({})
	const currentBGM = useRef<Howl | null>(null)
	const pendingBGM = useRef<string | null>(null)

	// Unlock AudioContext khi có tương tác
	useEffect(() => {
		const unlock = () => {
			// Đảm bảo ít nhất một Howl được tạo để Howler.ctx không null
			if (!sounds.current['__dummy__']) {
				sounds.current['__dummy__'] = new Howl({
					src: ['/audios/click.wav'],
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

		// Đăng ký sự kiện trên document thay vì window để chắc chắn bắt được gesture
		document.addEventListener('click', unlock, { once: true })
		document.addEventListener('keydown', unlock, { once: true })

		return () => {
			document.removeEventListener('click', unlock)
			document.removeEventListener('keydown', unlock)
		}
	}, [])

	// Tải tất cả âm thanh chỉ khi đã unlock
	useEffect(() => {
		if (!isUnlocked) return
		for (const [key, src] of Object.entries(soundSources)) {
			sounds.current[key] = new Howl({
				src: [src],
				volume: key.startsWith('bgm_') ? 0.4 : 1.0,
				loop: key.startsWith('bgm_'),
				preload: true,
			})
		}
	}, [isUnlocked])

	const playSFX = (name: string) => {
		if (!isUnlocked) return
		const sound = sounds.current[name]
		if (sound) {
			sound.play()
		}
	}

	const playBGM = useCallback(
		(name: string) => {
			if (!isUnlocked) {
				pendingBGM.current = name
				return
			}
			const sound = sounds.current[name]
			if (!sound) return

			// Nếu đang phát đúng bài này rồi thì không phát lại
			if (currentBGM.current === sound && currentBGM.current.playing()) {
				console.log('BGM is already playing')

				return
			}

			if (currentBGM.current && currentBGM.current.playing()) {
				currentBGM.current.stop()
			}

			console.log(`Playing BGM: ${name}`)

			currentBGM.current = sound
			sound.play()
		},
		[isUnlocked],
	)

	const stopBGM = () => {
		if (currentBGM.current && currentBGM.current.playing()) {
			currentBGM.current.stop()
			currentBGM.current = null
		}
		pendingBGM.current = null
	}

	// Khi đã unlock thì tự phát nhạc nền đang pending
	useEffect(() => {
		if (isUnlocked && pendingBGM.current) {
			playBGM(pendingBGM.current)
			pendingBGM.current = null
		}
	}, [isUnlocked, playBGM])

	return {
		playSFX,
		playBGM,
		stopBGM,
		isUnlocked,
	}
}
