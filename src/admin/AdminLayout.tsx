import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#080f1e] flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile menu button injected into header via context or prop */}
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
        </div>
      </main>
    </div>
  )
}