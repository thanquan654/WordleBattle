'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Medal, Crown, ArrowRight, LogOut, Star, Award } from 'lucide-react'
import Confetti from 'react-confetti'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useNavigate } from 'react-router'
import { resetRoom } from '@/store/RoomSlice'
// import { resetGame } from '@/store/GameSlice' // Nếu có
import { leaveARoom } from '@/apis/apiService'
import ResultSectionMultiPlayers from '@/components/ResultSectionMultiPlayers'
import ResultSection2Players from '@/components/ResultSection2Players'

export default function ResultScreen() {
	const dispatch = useDispatch()
	const navigator = useNavigate()
	const roomId = useSelector((state: RootState) => state.room.roomId)
	const currentUserId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const playersInGame = useSelector(
		(state: RootState) => state.game.playersInGame,
	)
	const roomPlayers = useSelector((state: RootState) => state.room.players)
	const gameSetting = useSelector((state: RootState) => state.room.gameRules)

	// Kết hợp avatar từ roomPlayers vào playersInGame
	const players = playersInGame
		.map((p) => {
			const roomPlayer = roomPlayers.find(
				(rp) => rp.playerId === p.playerId,
			)
			return {
				id: p.playerId,
				name: p.playerName || roomPlayer?.playerName || 'Người chơi',
				avatar:
					roomPlayer?.avatar ||
					'https://cdn-icons-png.flaticon.com/256/5772/5772500.png',
				score: p.totalScore,
				rank: p.rank,
				isCurrentUser: p.playerId === currentUserId,
			}
		})
		.sort((a, b) => a.rank - b.rank)

	const topPlayers = players.filter((player) => player.rank <= 3)

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

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 pt-4">
			{/* Confetti effect */}
			{showConfetti && (
				<Confetti
					width={windowSize.width}
					height={windowSize.height}
					recycle={false}
					numberOfPieces={500}
				/>
			)}

			{/* Background animated tiles */}
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

			<motion.div
				className="bg-white/90 backdrop-blur-sm rounded-t-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
				initial={{ opacity: 0, y: 1000 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center text-white">
					<h1 className="text-2xl font-bold mb-1">
						Kết Quả Trận Đấu
					</h1>
					<p className="text-white/80">
						Wordle Battle - Vòng {gameSetting.gameRound}/
						{gameSetting.gameRound} hoàn thành
					</p>
				</div>

				{players.length > 2 ? (
					<ResultSectionMultiPlayers
						players={players}
						topPlayers={topPlayers}
					/>
				) : (
					<ResultSection2Players players={players} />
				)}
			</motion.div>
		</div>
	)
}
