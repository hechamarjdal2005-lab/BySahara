import React from 'react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
  action?: React.ReactNode
}

export default function AdminHeader({ title, subtitle, onMenuClick, action }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0f172a]/80 backdrop-blur border-b border-white/5 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition p-1"
        >
          ☰
        </button>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">{title}</h1>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}