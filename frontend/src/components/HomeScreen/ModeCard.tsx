import { motion } from 'framer-motion'
import React from 'react'

export default function ModeCard({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10"
			whileHover={{ scale: 1.02 }}
			transition={{
				type: 'spring',
				stiffness: 400,
				damping: 10,
			}}
		>
			{children}
		</motion.div>
	)
}
