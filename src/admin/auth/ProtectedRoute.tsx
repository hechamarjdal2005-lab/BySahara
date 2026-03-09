import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#e8c547]/20 border-t-[#e8c547] animate-spin" />
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}