import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { Clock, HelpingHand, Repeat, Settings } from 'lucide-react'

export default function LobbySetting({
	players,
	currentPlayerId,
	handleChangeSettings,
	gameSetting,
	botId,
}) {
	return (
		<motion.div
			className="bg-white/10 rounded-xl p-4 mb-6 relative"
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			transition={{ duration: 0.3 }}
		>
			{players.find((p) => p.playerId === currentPlayerId)?.state !==
				'owner' && (
				<div className="absolute inset-0 z-10 rounded-xl bg-gray-400 opacity-70"></div>
			)}
			<div className="flex items-center space-x-2 mb-4">
				<Settings className="w-5 h-5 text-indigo-600" />
				<h3 className="font-semibold text-white">Cài đặt phòng</h3>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white ">
				{/* Number of rounds */}
				<div className="space-y-2 ">
					<label className="text-sm text-gray-300 flex items-center space-x-2">
						<Repeat className="w-4 h-4 text-gray-500" />
						<span>Số vòng đấu</span>
					</label>
					<Select
						value={gameSetting.gameRound}
						onValueChange={(value) =>
							handleChangeSettings({
								...gameSetting,
								gameRound: value,
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Chọn số vòng" />
						</SelectTrigger>
						<SelectContent className="bg-gray-300">
							<SelectItem value="3">3 vòng</SelectItem>
							<SelectItem value="4">4 vòng</SelectItem>
							<SelectItem value="5">5 vòng</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Turn time */}
				<div className="space-y-2">
					<label className="text-sm text-gray-300 flex items-center space-x-2">
						<Clock className="w-4 h-4 text-gray-500" />
						<span>Thời gian mỗi lượt</span>
					</label>
					<Select
						value={gameSetting.roundTime}
						onValueChange={(value) =>
							handleChangeSettings({
								...gameSetting,
								roundTime: value,
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Chọn thời gian" />
						</SelectTrigger>
						<SelectContent className="bg-gray-300">
							<SelectItem value="90">90 giây</SelectItem>
							<SelectItem value="120" defaultChecked>
								120 giây
							</SelectItem>
							<SelectItem value="150">150 giây</SelectItem>
							<SelectItem value="180">180 giây</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* BOT guess */}
				<div className="flex justify-between flex-col space-y-1">
					<label className="text-sm text-gray-300 flex items-center space-x-2">
						<Clock className="w-4 h-4 text-gray-500" />
						<span>Độ khó của BOT</span>
					</label>
					<Select
						value={gameSetting.botDifficult}
						onValueChange={(value) =>
							handleChangeSettings({
								...gameSetting,
								botDifficult: value,
							})
						}
						disabled={!botId}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Chọn thời gian" />
						</SelectTrigger>
						<SelectContent className="bg-gray-300">
							<SelectItem value="20">(Dễ) 20 giây</SelectItem>
							<SelectItem value="12" defaultChecked>
								(Trung Bình) 12 giây
							</SelectItem>
							<SelectItem value="8">(Khó) 8 giây</SelectItem>
							<SelectItem value="5">(Siêu khó) 5 giây</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Use BOT hints */}
				<div className="flex items-center justify-between">
					<label className="text-sm text-gray-300 flex items-center space-x-2">
						<HelpingHand className="w-4 h-4 text-gray-500" />
						<span>Sử dụng BOT hỗ trợ</span>
					</label>
					<Switch
						checked={gameSetting.isBotHelper}
						onCheckedChange={(checked) =>
							handleChangeSettings({
								...gameSetting,
								isBotHelper: checked,
							})
						}
						className="dark"
					/>
				</div>
			</div>
		</motion.div>
	)
}
