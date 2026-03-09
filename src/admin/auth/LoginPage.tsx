import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e8c547] to-[#c9a227] shadow-2xl mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">BySahara</h1>
          <p className="text-gray-400 mt-1 text-sm">Panneau d'administration</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@bysahara.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547]/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547]/50 transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#1a1a2e] font-bold text-sm tracking-wide hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          BySahara Admin © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}