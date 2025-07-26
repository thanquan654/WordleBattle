// Logic
import { useState } from 'react'
import { motion } from 'framer-motion'
// UI Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Users, BookOpen, Play, LogIn } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'
import HowToPlayModal from '@/components/HowToPlayModal'
import GameLogo from '@/components/ui/game-logo'
import HomePanel from '@/components/HomeScreen/HomePanel'
import ModeCard from '@/components/HomeScreen/ModeCard'
// Custom Hooks
import { useHomeForm } from '@/hooks/homeScreen/form'
import { useHomeAction } from '@/hooks/homeScreen/action'

export default function HomePage() {
	// States
	const {
		userName,
		roomId,
		errors: formErrors,
		setUserName,
		setRoomId,
		validateForm,
	} = useHomeForm()
	const {
		errors: actionErrors,
		isLoading,
		handleQuickPlay,
		handleSearchRoom,
	} = useHomeAction()
	const [isShowHelpModal, setShowHelpModal] = useState(false)

	// Handlers
	const handleClickPlayBtn = async (mode: 'quickPlay' | 'searchRoom') => {
		const isValid = validateForm(mode)

		if (!isValid) {
			return
		}

		if (mode === 'quickPlay') {
			await handleQuickPlay(userName)
		}
		if (mode === 'searchRoom') {
			await handleSearchRoom(roomId, userName)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 overflow-hidden">
			{/* Background animated tiles */}
			<AnimatedBackground variant="square" />

			<HowToPlayModal
				open={isShowHelpModal}
				onClose={() => setShowHelpModal(false)}
			/>

			<HomePanel>
				{/* Logo */}
				<GameLogo />

				{/* Username Input */}
				<div className="relative my-6">
					<div className="space-y-1">
						<Input
							placeholder="Tên hiển thị"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="w-full rounded-lg p-3 pl-4 text-center bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
						/>
					</div>
					<p className="text-xs text-red-600 text-center">
						{formErrors.userName}
					</p>
				</div>

				<motion.div
					className="space-y-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					{/* Single player Card */}
					<ModeCard>
						<h2 className="text-white font-bold flex items-center gap-2 mb-3">
							<Sparkles className="h-5 w-5 text-yellow-400" />
							Chế độ đơn
						</h2>

						<Button
							className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 font-medium cursor-pointer"
							onClick={() => handleClickPlayBtn('quickPlay')}
							disabled={isLoading}
						>
							<Play className="h-4 w-4" />
							Chơi ngay
						</Button>
						<p className="text-xs text-red-600 text-center">
							{actionErrors.quickPlay}
						</p>
					</ModeCard>

					{/* Multiplayer Card */}
					<motion.div
						className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10"
						whileHover={{ scale: 1.02 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 10,
						}}
					>
						<h2 className="text-white font-bold flex items-center gap-2 mb-3">
							<Users className="h-5 w-5 text-green-400" />
							Chế độ nhiều người
						</h2>

						<div className="relative">
							<Input
								placeholder="Nhập mã phòng"
								value={roomId}
								min={8}
								onChange={(e) =>
									setRoomId(e.target.value.toUpperCase())
								}
								className="w-full rounded-lg text-center p-3 pl-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
							/>
							<p className="text-xs text-red-600 text-center">
								{formErrors.roomId}
							</p>
						</div>

						<Button
							className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 font-medium cursor-pointer"
							onClick={() => handleClickPlayBtn('searchRoom')}
							disabled={isLoading}
						>
							<LogIn className="h-4 w-4" />
							Tham gia
						</Button>
						<p className="text-xs text-red-600 text-center">
							{actionErrors.searchRoom}
						</p>
					</motion.div>

					{/* How to play button */}
					<motion.div
						className="pt-2"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
					>
						<Button
							variant="outline"
							className="w-full dark border bg-white/5 border-white/20 text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
							onClick={() => setShowHelpModal(true)}
						>
							<BookOpen className="h-4 w-4" />
							Hướng dẫn chơi
						</Button>
					</motion.div>
				</motion.div>

				{/* Decorative elements */}
				<div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-3 0"></div>
				<div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
			</HomePanel>
		</div>
	)
}
