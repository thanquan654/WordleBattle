// Logic
import { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useGameResult } from '@/hooks/useGameResult'
import { useConfettiEffect } from '@/hooks/useConfettiEffect'
import { useAudioManager } from '@/hooks/useAudioManager'

// UI Components
import AppBackground from '@/components/AppBackground'
import AnimatedBackground from '@/components/AnimatedBackground'
import MainPagePanel from '@/components/MainPagePanel'
import ResultSectionMultiPlayers from '@/components/ResultScreen/ResultSectionMultiPlayers'
import ResultSection2Players from '@/components/ResultScreen/ResultSection2Players'

export default function ResultScreen() {
	const { players, topPlayers, totalRounds } = useGameResult()
	const { showConfetti, windowSize } = useConfettiEffect()
	const { playBGM, stopBGM } = useAudioManager()

	useEffect(() => {
		playBGM('bgm_result')
		return () => {
			stopBGM()
		}
	}, [playBGM, stopBGM])

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

			<AnimatedBackground variant="square" />

			<MainPagePanel>
				{/* Header */}
				<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center text-white">
					<h1 className="text-2xl font-bold mb-1">
						Kết Quả Trận Đấu
					</h1>
					<p className="text-white/80 text-sm">
						Hoàn thành {totalRounds}/{totalRounds} vòng
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
