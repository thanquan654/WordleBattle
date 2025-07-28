import React from 'react'

export default function AppBackground({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center ${className}`}
		>
			{children}
		</div>
	)
}
