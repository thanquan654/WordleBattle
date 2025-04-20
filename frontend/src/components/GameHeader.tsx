import React from 'react'

export default function GameHeader({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between text-white">
			{children}
		</div>
	)
}
