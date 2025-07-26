import { useState } from 'react'

const TABS = [
	{ key: 'game', label: 'Trò chơi' },
	{ key: 'bot', label: 'Bot' },
	{ key: 'score', label: 'Cách tính điểm' },
]

export default function HowToPlayModal({
	open,
	onClose,
}: {
	open: boolean
	onClose: () => void
}) {
	const [tab, setTab] = useState('game')

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-slate-700 mx-4 border border-white/10 rounded-xl shadow-2xl w-full max-w-md relative">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
					<span className="font-mono text-base text-white">
						Hướng dẫn chơi
					</span>
					<button
						onClick={onClose}
						className="text-2xl px-2 py-1 text-gray-300 hover:bg-white/10 hover:text-white rounded transition"
					>
						×
					</button>
				</div>

				{/* Tab navigation */}
				<div className="flex border-b border-white/10 bg-slate-800">
					{TABS.map((t) => (
						<button
							key={t.key}
							className={`flex-1 px-4 py-2 text-sm font-semibold transition ${
								tab === t.key
									? 'border-b-2 border-cyan-400 text-cyan-300 bg-slate-800'
									: 'text-gray-400 hover:text-cyan-200'
							}`}
							onClick={() => setTab(t.key)}
						>
							{t.label}
						</button>
					))}
				</div>

				{/* Tab content */}
				<div className="p-4 min-h-[220px] max-h-[60vh] text-white overflow-y-auto">
					{tab === 'game' && (
						<div>
							<h3 className="font-bold mb-2 text-cyan-300">
								Hướng dẫn chơi Wordle Battle
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									<strong>Wordle Battle</strong> là trò chơi
									đoán từ bí mật, nơi bạn thi đấu với người
									chơi khác (hoặc bot) để xem ai đoán đúng
									nhiều từ nhất trong số lượt và thời gian
									giới hạn.
								</li>
								<li>
									Mỗi ván gồm nhiều câu đố (puzzle), mỗi câu
									là một từ bí mật với độ dài từ 3 đến 6 ký
									tự.
								</li>
								<li>
									Ở mỗi câu, bạn có tối đa{' '}
									<b>số lượt đoán = số ký tự của từ + 1</b>.
									Sau mỗi lượt đoán, hệ thống sẽ phản hồi bằng
									màu sắc:
									<ul className="list-disc pl-5">
										<li>
											<div className="w-4 h-4 inline-block mr-1 bg-green-400 font-semibold"></div>
											: Chữ cái đúng vị trí.
										</li>
										<li>
											<div className="w-4 h-4 inline-block mr-1 bg-yellow-300 font-semibold"></div>
											: Chữ cái có trong từ nhưng sai vị
											trí.
										</li>
										<li>
											<span className="w-4 h-4 inline-block mr-1 bg-gray-400 font-semibold"></span>
											: Chữ cái không có trong từ.
										</li>
									</ul>
								</li>
								<li>
									Bạn và đối thủ cùng đoán song song, ai đoán
									đúng trước sẽ được nhiều điểm hơn.
								</li>
								<li>
									Sau khi hoàn thành tất cả các câu, hệ thống
									sẽ tổng kết điểm và xếp hạng.
								</li>
								<li>
									Bạn có thể chơi với bạn bè, với bot hoặc
									nhiều người cùng lúc.
								</li>
							</ul>
						</div>
					)}
					{tab === 'bot' && (
						<div>
							<h3 className="font-bold mb-2 text-cyan-300">
								Bot
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									Bạn có thể thêm <b>Bot</b> vào phòng để
									luyện tập hoặc tăng độ thử thách.
								</li>
								<li>
									Bot sẽ tự động tham gia và đoán từ như người
									chơi thật, sử dụng thuật toán thông minh để
									chọn từ đoán.
								</li>
								<li>
									Có thể điều chỉnh <b>độ khó của Bot</b>{' '}
									trong phần cài đặt phòng:
									<ul className="list-disc pl-5">
										<li>
											<b>Dễ</b>: Bot đoán chậm, dễ bị
											thua.
										</li>
										<li>
											<b>Trung bình</b>: Bot đoán ở tốc độ
											vừa phải.
										</li>
										<li>
											<b>Khó</b>: Bot đoán nhanh và chính
											xác hơn.
										</li>
										<li>
											<b>Siêu khó</b>: Bot đoán rất nhanh,
											gần như tối ưu.
										</li>
									</ul>
								</li>
								<li>
									Bạn cũng có thể bật <b>Bot hỗ trợ</b> để
									nhận gợi ý từ bot khi chơi.
								</li>
								<li>
									Bot sẽ tự động kết thúc ván khi đoán đúng
									hoặc hết lượt.
								</li>
							</ul>
						</div>
					)}
					{tab === 'score' && (
						<div>
							<h3 className="font-bold mb-2 text-cyan-300">
								Cách tính điểm
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									Điểm số của bạn phụ thuộc vào{' '}
									<b>số lượt đoán đúng</b> và{' '}
									<b>thời gian còn lại</b> khi đoán đúng.
								</li>
								<li>
									<b>Công thức điểm:</b> <br />
									<span className="text-cyan-200">
										Điểm = 5000 + (100 × Thời gian còn lại)
									</span>
								</li>
								<li>
									Đoán đúng càng sớm, điểm càng cao. Nếu hết
									lượt mà chưa đoán đúng, bạn sẽ không được
									điểm cho câu đó.
								</li>
								<li>
									Tổng điểm là tổng điểm của tất cả các câu đố
									trong ván chơi.
								</li>
								<li>
									Bảng xếp hạng sẽ dựa trên tổng điểm của tất
									cả người chơi trong phòng.
								</li>
								<li>
									Nếu nhiều người cùng điểm, hệ thống sẽ xếp
									hạng dựa trên thời gian hoàn thành.
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
