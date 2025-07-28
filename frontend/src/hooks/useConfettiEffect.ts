import { useEffect, useState } from 'react'

export const useConfettiEffect = () => {
	const [showConfetti, setShowConfetti] = useState(true)
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	})

	// Update window size for confetti
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', handleResize)

		// Stop confetti after 5 seconds
		const timer = setTimeout(() => {
			setShowConfetti(false)
		}, 5000)

		return () => {
			window.removeEventListener('resize', handleResize)
			clearTimeout(timer)
		}
	}, [])

	return { showConfetti, windowSize }
}
