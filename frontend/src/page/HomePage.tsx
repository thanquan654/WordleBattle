// Logic
import { useState } from 'react'
import { createRoom, getRoomInfo, joinARoom } from '@/apis/apiService'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import {
	setCurrentPlayerId,
	setRoomId as setRoomIdAction,
} from '@/store/RoomSlice'
import { v4 as uuidv4 } from 'uuid'
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

export default function HomePage() {
	// Utils
	const navigator = useNavigate()
	const dispatch = useDispatch()

	// States
	const [userName, setUserName] = useState<string>(
		localStorage.getItem('name') ?? '',
	)
	const [roomId, setRoomId] = useState<string>('')
	const [userNameErrorMessage, setUserNameErrorMessage] = useState<string>('')
	const [roomIdErrorMessage, setRoomIdErrorMessage] = useState<string>('')
	const [showHelp, setShowHelp] = useState(false)

	// Handlers
	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(event.target.value)
		setUserNameErrorMessage('')
	}

	const handleRoomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomId(event.target.value.toUpperCase())
		setRoomIdErrorMessage('')
	}

	const handleClickPlayBtn = async (mode: 'quickPlay' | 'searchRoom') => {
		if (!userName) {
			setUserNameErrorMessage('Vui lòng nhập tên trước khi chơi')
			return
		}
		if ((!roomId || roomId.length !== 4) && mode === 'searchRoom') {
			setRoomIdErrorMessage('Mã phòng có độ dài 4 ký tự')
			return
		}

		if (mode === 'quickPlay') {
			const userId = localStorage.getItem('userId') ?? uuidv4()
			const respone = await createRoom(userId, userName)

			if (respone?.status === 200) {
				dispatch(setCurrentPlayerId(userId))
				dispatch(setRoomIdAction(respone.data.roomId))

				localStorage.setItem('userId', userId)
				localStorage.setItem('name', userName)

				navigator('/lobby/' + respone.data.roomId)
			} else {
				setUserNameErrorMessage(
					'Có lỗi xảy ra trong quá trình tạo phòng mới',
				)
			}
		}
		if (mode === 'searchRoom') {
			const respone = await getRoomInfo(roomId)

			if (respone?.status === 200) {
				const userId = localStorage.getItem('userId') ?? uuidv4()
				localStorage.setItem('userId', userId)
				localStorage.setItem('name', userName)

				const respone2 = await joinARoom(roomId, {
					id: userId,
					name: userName,
					isBot: false,
				})

				if (respone2?.status === 200) {
					dispatch(setRoomIdAction(respone2?.data.roomId))

					navigator('/lobby/' + respone2?.data.roomId)
				} else {
					setRoomIdErrorMessage(
						'Có lỗi xảy ra trong quá trình tìm phòng',
					)
				}
			}
			if (respone?.status === 404) {
				setRoomIdErrorMessage('Không tìm thấy phòng')
			} else {
				setRoomIdErrorMessage('Có lỗi xảy ra trong quá trình tìm phòng')
			}
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 overflow-hidden">
			{/* Background animated tiles */}
			<AnimatedBackground variant="square" />

			<HowToPlayModal
				open={showHelp}
				onClose={() => setShowHelp(false)}
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
							onChange={handleNameChange}
							className="w-full rounded-lg p-3 pl-4 text-center bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
						/>
					</div>
					<p className="text-xs text-red-600 text-center">
						{userNameErrorMessage}
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
						>
							<Play className="h-4 w-4" />
							Chơi ngay
						</Button>
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
								onChange={handleRoomIdChange}
								className="w-full rounded-lg text-center p-3 pl-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
							/>
							<p className="text-xs text-red-600 text-center">
								{roomIdErrorMessage}
							</p>
						</div>

						<Button
							className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 font-medium cursor-pointer"
							onClick={() => handleClickPlayBtn('searchRoom')}
						>
							<LogIn className="h-4 w-4" />
							Tham gia
						</Button>
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
							onClick={() => setShowHelp(true)}
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
