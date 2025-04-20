import { motion } from 'framer-motion'

type AnimatedBackgroundProps = {
	variant: 'square' | 'character'
}

export default function AnimatedBackground({
	variant,
}: AnimatedBackgroundProps) {
	if (variant === 'square') {
		return (
			<div className="absolute inset-0 overflow-hidden opacity-10">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-16 h-16 border-2 border-white rounded-md"
						initial={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
							rotate: 0,
						}}
						animate={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
							rotate: 360,
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: 'reverse',
						}}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="absolute inset-0 overflow-hidden">
			{Array.from({ length: 15 }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute opacity-10 text-white font-bold text-4xl"
					initial={{
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						opacity: 0.05,
					}}
					animate={{
						y: [
							Math.random() * window.innerHeight,
							Math.random() * window.innerHeight,
						],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{
						duration: 10 + Math.random() * 20,
						repeat: Infinity,
						repeatType: 'reverse',
					}}
				>
					{String.fromCharCode(65 + Math.floor(Math.random() * 26))}
				</motion.div>
			))}
		</div>
	)
}
