import { motion } from 'framer-motion'
import React from 'react'

export default function HomePanel({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</motion.div>
	)
}
