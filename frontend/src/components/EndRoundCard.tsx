import { Separator } from '@/components/ui/separator'
import { Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface IProps {
	isFindSecretWord: boolean
	currentRemainingTime: number
}

export default function EndRoundCard({
	isFindSecretWord,
	currentRemainingTime,
}: IProps) {
	const findWordPoint = isFindSecretWord ? 5000 : 0
	const timePoint = currentRemainingTime * 100
	const totalPoint = findWordPoint + timePoint

	return (
		<div className="w-full max-w-xs mx-auto rounded-2xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 p-6 flex flex-col items-center gap-4">
			{/* Status */}
			<div className="flex items-center gap-2 mb-2">
				{isFindSecretWord ? (
					<CheckCircle2 className="w-7 h-7 text-green-400 drop-shadow" />
				) : (
					<XCircle className="w-7 h-7 text-red-400 drop-shadow" />
				)}
				<span
					className={`text-lg font-bold tracking-wide ${
						isFindSecretWord ? 'text-green-300' : 'text-red-300'
					}`}
				>
					{isFindSecretWord
						? 'Bạn đã tìm đúng từ!'
						: 'Bạn chưa tìm đúng từ!'}
				</span>
			</div>

			<Separator className="w-full bg-white/20" />

			{/* Points */}
			<div className="w-full flex flex-col gap-2">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2 text-white/80">
						<Sparkles className="w-5 h-5 text-yellow-400" />
						<span className="font-medium">Điểm tìm từ</span>
					</div>
					<span className="font-bold text-yellow-300">
						{findWordPoint}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2 text-white/80">
						<Clock className="w-5 h-5 text-blue-300" />
						<span className="font-medium">Điểm thời gian</span>
					</div>
					<span className="font-bold text-blue-200">
						+{timePoint}
					</span>
				</div>
			</div>

			<Separator className="w-full bg-white/20" />

			{/* Total */}
			<div className="flex justify-between items-center w-full mt-2">
				<span className="text-base font-semibold text-white">
					Tổng điểm
				</span>
				<span className="text-2xl font-extrabold text-green-300 drop-shadow">
					{totalPoint}
				</span>
			</div>
		</div>
	)
}
