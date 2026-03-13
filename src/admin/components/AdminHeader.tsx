import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
  action?: React.ReactNode
}

export default function AdminHeader({ title, subtitle, onMenuClick, action }: AdminHeaderProps) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotif, setShowNotif] = useState(false)
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    const channel = supabase.channel('notif-header')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, (payload) => {
        setNotifications(prev => [payload.new, ...prev].slice(0, 10))
        setUnread(u => u + 1)
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchNotifications = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(10)
    setNotifications(data ?? [])
    setUnread((data ?? []).filter((m: any) => !m.is_read).length)
  }

  const markAllRead = async () => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('is_read', false)
    setUnread(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Bonjour' : now.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl transition hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span style={{ fontSize: '18px' }}>☰</span>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-lg leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h1>
          </div>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {action && <div>{action}</div>}

        {/* Notifications Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: unread > 0 ? '#e8c547' : 'rgba(255,255,255,0.4)' }}
          >
            <span style={{ fontSize: '18px' }}>🔔</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#ef4444', color: '#fff', fontSize: '10px', animation: 'pulse 2s infinite' }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-white font-semibold text-sm">Notifications</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{unread} non lu(s)</p>
                </div>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs px-3 py-1 rounded-lg transition hover:bg-white/10"
                    style={{ color: '#e8c547', border: '1px solid rgba(232,197,71,0.2)' }}>
                    Tout lire
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <p className="text-2xl mb-2">📭</p>
                    <p className="text-xs">Aucune notification</p>
                  </div>
                ) : notifications.map(n => (
                  <div key={n.id}
                    onClick={() => { navigate('/admin/messages'); setShowNotif(false) }}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition hover:bg-white/5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: n.is_read ? 0.5 : 1 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{ background: n.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(232,197,71,0.15)', color: n.is_read ? '#666' : '#e8c547' }}>
                      {n.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: n.is_read ? 'rgba(255,255,255,0.5)' : '#fff' }}>{n.name}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{n.subject}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.is_read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#e8c547' }} />}
                  </div>
                ))}
              </div>

              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => { navigate('/admin/messages'); setShowNotif(false) }}
                  className="w-full py-2 rounded-xl text-xs font-medium transition hover:bg-white/10"
                  style={{ color: '#e8c547', border: '1px solid rgba(232,197,71,0.15)' }}>
                  Voir tous les messages →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Greeting */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '14px' }}>👋</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{greeting}</span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }`}</style>
    </header>
  )
}