// Logic
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

// UI Components
import AppBackground from '@/components/AppBackground'
import AnimatedBackground from '@/components/AnimatedBackground'
import MainPagePanel from '@/components/MainPagePanel'
import ResultSectionMultiPlayers from '@/components/ResultSectionMultiPlayers'
import ResultSection2Players from '@/components/ResultSection2Players'

type Players = {
	id: string
	name: string
	avatar: string
	score: number
	rank: number
	isCurrentUser: boolean
	isBot: boolean
	puzzleResults: ('playing' | 'win' | 'lost')[]
}[]

export default function ResultScreen() {
	const currentUserId = useSelector(
		(state: RootState) => state.room.currentPlayerId,
	)
	const playersInGame = useSelector(
		(state: RootState) => state.game.playersInGame,
	)
	const roomPlayers = useSelector((state: RootState) => state.room.players)
	const gameSetting = useSelector((state: RootState) => state.room.gameRules)
	const gameData = useSelector((state: RootState) => state.game)

	// Kết hợp avatar từ roomPlayers vào playersInGame
	const players = playersInGame
		.map((p) => {
			const roomPlayer = roomPlayers.find(
				(rp) => rp.playerId === p.playerId,
			)
			// Lấy kết quả từng câu cho player này
			const puzzleResults = gameSetting.gameRound
				? Array.from({ length: Number(gameSetting.gameRound) }).map(
						(_, idx) => {
							const puzzle = gameData.puzzles[idx]
							const playerPuzzle = puzzle?.playerPuzzleData?.find(
								(pp) => pp.playerId === p.playerId,
							)
							return playerPuzzle?.gameStatus || 'lost'
						},
				  )
				: []
			return {
				id: p.playerId,
				name: p.playerName || roomPlayer?.playerName || 'Người chơi',
				avatar:
					roomPlayer?.avatar ||
					'https://cdn-icons-png.flaticon.com/256/5772/5772500.png',
				score: p.totalScore,
				rank: p.rank,
				isCurrentUser: p.playerId === currentUserId,
				isBot: roomPlayer?.state === 'bot',
				puzzleResults, // ['win', 'lost', ...]
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
		<AppBackground className="px-4 pt-4">
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
			<AnimatedBackground variant="square" />

			<MainPagePanel>
				{/* Header */}
				<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center text-white">
					<h1 className="text-2xl font-bold mb-1">
						Kết Quả Trận Đấu
					</h1>
					<p className="text-white/80 text-sm">
						Hoàn thành {gameSetting.gameRound}/
						{gameSetting.gameRound} vòng
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
			</MainPagePanel>
		</AppBackground>
	)
}
