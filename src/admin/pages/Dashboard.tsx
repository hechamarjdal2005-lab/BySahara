import React from 'react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import { supabase } from '../../lib/supabase'

interface StatCard {
  label: string
  value: number | string
  icon: string
  color: string
}

export default function Dashboard() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [products, cooperatives, categories, partners, reviews, banners] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('cooperatives').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('banners').select('id', { count: 'exact', head: true }),
      ])

      setStats([
        { label: 'Produits', value: products.count ?? 0, icon: '📦', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400' },
        { label: 'Coopératives', value: cooperatives.count ?? 0, icon: '🤝', color: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400' },
        { label: 'Catégories', value: categories.count ?? 0, icon: '🏷️', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400' },
        { label: 'Partenaires', value: partners.count ?? 0, icon: '🌟', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400' },
        { label: 'Avis clients', value: reviews.count ?? 0, icon: '⭐', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400' },
        { label: 'Bannières', value: banners.count ?? 0, icon: '🖼️', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400' },
      ])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const quickLinks = [
    { label: 'Ajouter un produit', icon: '➕', path: '/admin/products', color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' },
    { label: 'Gérer les banners', icon: '🖼️', path: '/admin/media', color: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' },
    { label: 'Voir les avis', icon: '⭐', path: '/admin/products', color: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' },
    { label: 'Paramètres site', icon: '⚙️', path: '/admin/settings', color: 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20' },
  ]

  return (
    <div>
      <AdminHeader
        title="Tableau de bord"
        subtitle={`Bienvenue — ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div>
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Vue d'ensemble</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map(stat => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-4 flex flex-col gap-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-white font-bold text-2xl leading-none">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <a
                key={link.label}
                href={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${link.color}`}
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-[#e8c547]/5 border border-[#e8c547]/10 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-[#e8c547] font-semibold text-sm mb-1">Conseil</p>
            <p className="text-gray-400 text-sm">
              Toutes les modifications sont appliquées en temps réel sur le site. 
              Utilisez le bouton <strong className="text-gray-300">Actif / Inactif</strong> pour masquer temporairement un élément sans le supprimer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}