import { motion } from 'framer-motion'
import { Ellipsis } from 'lucide-react'
import React from 'react'

export default function EmptyPlayerCard() {
	return (
		<motion.div
			className="bg-white/3 rounded-xl border border-dashed border-white/20 p-3 flex flex-col items-center justify-center h-[120px]  transition cursor-pointer"
			transition={{
				type: 'spring',
				stiffness: 400,
				damping: 10,
			}}
		>
			<Ellipsis className="w-5 h-5 text-gray-500" />

			<div className="text-sm text-gray-500">Đợi thêm người chơi</div>
		</motion.div>
	)
}
