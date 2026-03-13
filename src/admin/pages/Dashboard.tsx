import React, { useEffect, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import { supabase } from '../../lib/supabase'

// ── Mini Sparkline Chart ──────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 32, pts = data.length
  const points = data.map((v, i) => {
    const x = (i / (pts - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Bar Chart ─────────────────────────────────────────────────
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all duration-700"
            style={{ height: `${(v / max) * 80}px`, background: color, opacity: 0.7 + (i / data.length) * 0.3, minHeight: '4px' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ── Donut Chart ───────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  let offset = 0
  const r = 40, cx = 50, cy = 50, stroke = 12
  const circumference = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const pct = seg.value / total
          const dash = pct * circumference
          const dashOffset = circumference - offset * circumference
          offset += pct
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)', transition: 'stroke-dasharray 1s ease' }}
            />
          )
        })}
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{seg.label}</span>
            <span className="text-xs font-bold ml-auto" style={{ color: '#fff' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, color, spark, trend }: any) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const target = parseInt(value) || 0
    let start = 0
    const step = Math.ceil(target / 30)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setDisplayed(target); clearInterval(timer) }
      else setDisplayed(start)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="relative rounded-2xl p-5 overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-default"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}10, transparent 60%)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          {icon}
        </div>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
      <p className="text-3xl font-bold text-white mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
        {displayed.toLocaleString()}
      </p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs font-semibold" style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>vs mois dernier</span>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [stats, setStats] = useState({ products: 0, cooperatives: 0, categories: 0, partners: 0, reviews: 0, messages: 0, unread: 0, packs: 0 })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msgByDay, setMsgByDay] = useState<number[]>([])
  const [msgLabels, setMsgLabels] = useState<string[]>([])
  const [reviewDist, setReviewDist] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const [
        { count: products },
        { count: cooperatives },
        { count: categories },
        { count: partners },
        { count: reviews },
        { count: messages },
        { count: unread },
        { count: packs },
        { data: recentMsgs },
        { data: allReviews },
        { data: allMessages },
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('cooperatives').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('packs').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('reviews').select('rating'),
        supabase.from('contact_messages').select('created_at').order('created_at', { ascending: false }).limit(30),
      ])

      setStats({
        products: products ?? 0, cooperatives: cooperatives ?? 0,
        categories: categories ?? 0, partners: partners ?? 0,
        reviews: reviews ?? 0, messages: messages ?? 0,
        unread: unread ?? 0, packs: packs ?? 0,
      })
      setRecentMessages(recentMsgs ?? [])

      // Messages par jour (7 derniers jours)
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d
      })
      const labels = days.map(d => d.toLocaleDateString('fr-FR', { weekday: 'short' }))
      const counts = days.map(d => {
        const dateStr = d.toISOString().slice(0, 10)
        return (allMessages ?? []).filter((m: any) => m.created_at?.slice(0, 10) === dateStr).length
      })
      setMsgByDay(counts)
      setMsgLabels(labels)

      // Distribution ratings
      const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        value: (allReviews ?? []).filter((rv: any) => Math.round(rv.rating) === r).length,
        color: r >= 4 ? '#22c55e' : r === 3 ? '#e8c547' : '#ef4444',
        label: `${r} étoile${r > 1 ? 's' : ''}`,
      }))
      setReviewDist(ratingCounts)

      setLoading(false)
    }
    load()
  }, [])

  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const STAT_CARDS = [
    { label: 'Produits', value: stats.products, icon: '📦', color: '#3b82f6', spark: [3,5,4,7,6,8,stats.products], trend: 12 },
    { label: 'Coopératives', value: stats.cooperatives, icon: '🤝', color: '#22c55e', spark: [1,2,2,3,3,4,stats.cooperatives], trend: 5 },
    { label: 'Packs', value: stats.packs, icon: '🎁', color: '#e8c547', spark: [0,1,2,2,3,4,stats.packs], trend: 8 },
    { label: 'Partenaires', value: stats.partners, icon: '🌟', color: '#a855f7', spark: [2,3,3,4,4,5,stats.partners], trend: 0 },
    { label: 'Avis clients', value: stats.reviews, icon: '⭐', color: '#f97316', spark: [10,15,12,18,20,22,stats.reviews], trend: 15 },
    { label: 'Messages reçus', value: stats.messages, icon: '✉️', color: '#ec4899', spark: [1,3,2,4,3,5,stats.messages], trend: stats.unread > 0 ? stats.unread * 10 : 0 },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AdminHeader
        title="Tableau de bord"
        subtitle={date}
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">

        {/* Welcome banner */}
        <div className="relative rounded-2xl overflow-hidden p-6"
          style={{ background: 'linear-gradient(135deg, #e8c547 0%, #c9a227 50%, #a07a1a 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-20">🌿</div>
          <div className="relative">
            <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(10,14,26,0.7)' }}>
              {new Date().getHours() < 12 ? '🌅 Bonjour' : new Date().getHours() < 18 ? '☀️ Bon après-midi' : '🌙 Bonsoir'}
            </p>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: '#0a0e1a' }}>
              Bienvenue sur BySahara Admin
            </h2>
            <p className="text-sm" style={{ color: 'rgba(10,14,26,0.6)' }}>
              {stats.unread > 0
                ? `⚠️ Vous avez ${stats.unread} message(s) non lu(s)`
                : '✅ Tout est à jour — aucun message en attente'}
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAT_CARDS.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Messages par jour */}
          <div className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Messages reçus</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>7 derniers jours</p>
              </div>
              <Link to="/admin/messages"
                className="text-xs px-3 py-1.5 rounded-lg transition hover:bg-white/10"
                style={{ color: '#e8c547', border: '1px solid rgba(232,197,71,0.2)' }}>
                Voir tout →
              </Link>
            </div>
            <BarChart data={msgByDay.length ? msgByDay : [0,0,0,0,0,0,0]} labels={msgLabels.length ? msgLabels : ['L','M','M','J','V','S','D']} color="#e8c547" />
          </div>

          {/* Reviews distribution */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="mb-5">
              <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Distribution avis</h3>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Par note</p>
            </div>
            <DonutChart segments={reviewDist.length ? reviewDist : [
              { value: 1, color: '#22c55e', label: '5 étoiles' },
              { value: 1, color: '#e8c547', label: '3 étoiles' },
              { value: 1, color: '#ef4444', label: '1 étoile' },
            ]} />
          </div>
        </div>

        {/* Recent Messages + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent messages */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Derniers messages</h3>
              {stats.unread > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#ef4444', color: '#fff' }}>
                  {stats.unread} non lu(s)
                </span>
              )}
            </div>
            {recentMessages.length === 0 ? (
              <div className="text-center py-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <p className="text-3xl mb-2">📭</p>
                <p className="text-xs">Aucun message</p>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                {recentMessages.map(msg => (
                  <li key={msg.id}>
                    <Link to="/admin/messages" className="flex items-start gap-3 px-5 py-3 transition hover:bg-white/5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                        style={{ background: msg.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(232,197,71,0.15)', color: msg.is_read ? '#666' : '#e8c547' }}>
                        {msg.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate" style={{ color: msg.is_read ? 'rgba(255,255,255,0.4)' : '#fff' }}>{msg.name}</p>
                          {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#e8c547' }} />}
                        </div>
                        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{msg.subject}</p>
                      </div>
                      <p className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Actions rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nouveau produit', icon: '📦', path: '/admin/products', color: '#3b82f6' },
                { label: 'Nouveau pack', icon: '🎁', path: '/admin/packs', color: '#e8c547' },
                { label: 'Gérer médias', icon: '🖼️', path: '/admin/media', color: '#a855f7' },
                { label: 'Messages', icon: '✉️', path: '/admin/messages', color: '#ec4899', badge: stats.unread },
                { label: 'Coopératives', icon: '🤝', path: '/admin/cooperatives', color: '#22c55e' },
                { label: 'Paramètres', icon: '⚙️', path: '/admin/settings', color: '#64748b' },
              ].map((a, i) => (
                <Link key={i} to={a.path}
                  className="relative flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: `${a.color}10`, border: `1px solid ${a.color}20` }}>
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-xs font-medium" style={{ color: a.color }}>{a.label}</span>
                  {a.badge > 0 && (
                    <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#ef4444', color: '#fff', fontSize: '9px' }}>
                      {a.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* System info */}
            <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(232,197,71,0.05)', border: '1px solid rgba(232,197,71,0.1)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#e8c547' }}>💡 Info système</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Les modifications sont appliquées en temps réel. Utilisez <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Actif/Inactif</strong> pour masquer sans supprimer.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}