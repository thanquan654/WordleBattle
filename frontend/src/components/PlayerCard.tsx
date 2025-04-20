import { motion } from 'framer-motion'
import { Crown, Check, Ellipsis, Bot } from 'lucide-react'
type PlayerStatus = 'owner' | 'bot' | 'ready' | 'waiting'

interface IPlayerCardProps {
	name: string
	status: PlayerStatus
	avartar: string
	isCurrentUser: boolean
}

const getStatusColor = (status: PlayerStatus) => {
	switch (status) {
		case 'owner':
			return 'bg-amber-500'
		case 'ready':
			return 'bg-emerald-500'
		case 'waiting':
			return 'bg-gray-400'
		case 'bot':
			return 'bg-blue-400'
	}
}
const getStatusIcon = (status: PlayerStatus) => {
	switch (status) {
		case 'owner':
			return <Crown className="w-4 h-4 text-white" />
		case 'ready':
			return <Check className="w-4 h-4 text-white" />
		case 'bot':
			return <Bot className="w-4 h-4 text-white" />
		case 'waiting':
			return <Ellipsis className="w-4 h-4 text-white" />
	}
}

export default function PlayerCard({
	name,
	status,
	isCurrentUser,
	avartar,
}: IPlayerCardProps) {
	return (
		<motion.div
			className={`bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col items-center relative hover:bg-white/15 transition cursor-pointer`}
			whileHover={{ scale: 1.02 }}
			transition={{
				type: 'spring',
				stiffness: 400,
				damping: 10,
			}}
		>
			{/* Status indicator */}
			<div
				className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getStatusColor(
					status,
				)} flex items-center justify-center shadow-md`}
			>
				{getStatusIcon(status)}
			</div>

			{/* Avatar */}
			<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mb-2">
				<img
					src={avartar}
					alt={name}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Name */}
			<div className="text-center">
				<div className="font-medium text-white truncate max-w-full">
					{name}
				</div>
				<div className="text-xs text-gray-300">
					{isCurrentUser ? '(Bạn)' : ''}
				</div>
			</div>
		</motion.div>
	)
}
