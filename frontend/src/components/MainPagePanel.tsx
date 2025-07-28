import { motion } from 'framer-motion'
import React from 'react'

export default function MainPagePanel({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<motion.div
			className={`bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden ${className}`}
			initial={{ opacity: 0, y: 1000 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
		>
			{children}
		</motion.div>
	)
}
