import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../../lib/supabase'

const NAV = [
  { label: 'Tableau de bord', icon: '▦', path: '/admin', end: true },
  { label: 'Produits', icon: '◈', path: '/admin/products' },
  { label: 'Catégories', icon: '◉', path: '/admin/categories' },
  { label: 'Coopératives', icon: '◎', path: '/admin/cooperatives' },
  { label: 'Packs & Offres', icon: '◇', path: '/admin/packs' },
  { label: 'Médias', icon: '◫', path: '/admin/media' },
  { label: 'Partenaires', icon: '◈', path: '/admin/partners' },
  { label: 'Messages', icon: '◻', path: '/admin/messages', badge: true },
  { label: 'Contenu', icon: '◪', path: '/admin/content' },
  { label: 'Pied de page', icon: '◧', path: '/admin/footer' },
  { label: 'Paramètres', icon: '◑', path: '/admin/settings' },
]

interface SidebarProps {
  open: boolean
  setOpen: (v: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function Sidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false)
      .then(({ count }) => setUnread(count ?? 0))

    const channel = supabase.channel('messages-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false)
          .then(({ count }) => setUnread(count ?? 0))
      }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed
      `}
        style={{
          background: 'linear-gradient(180deg, #0d1117 0%, #0a0e1a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', boxShadow: '0 4px 16px rgba(232,197,71,0.3)' }}>
            🌿
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>BySahara</p>
              <p className="text-xs mt-0.5" style={{ color: '#e8c547', opacity: 0.7 }}>Administration</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-all hover:bg-white/10 flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <span style={{ fontSize: '12px' }}>{collapsed ? '›' : '‹'}</span>
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500 hover:text-white transition ml-auto">✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {!collapsed && <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>Navigation</p>}
          <ul className="space-y-0.5">
            {NAV.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }
                  `}
                  style={({ isActive }) => isActive ? {
                    background: 'linear-gradient(135deg, rgba(232,197,71,0.15), rgba(232,197,71,0.05))',
                    border: '1px solid rgba(232,197,71,0.2)',
                  } : {}}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                          style={{ background: '#e8c547' }} />
                      )}
                      <span className={`text-base flex-shrink-0 transition-all ${isActive ? 'text-yellow-400' : ''}`}
                        style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge && unread > 0 && (
                        <span className="flex-shrink-0 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: '#ef4444', color: '#fff', fontSize: '10px' }}>
                          {unread > 9 ? '9+' : unread}
                        </span>
                      )}
                      {collapsed && item.badge && unread > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50"
                          style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {!collapsed ? (
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0a0e1a' }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user?.email}</p>
                  <p className="text-xs" style={{ color: '#e8c547', opacity: 0.6 }}>Administrateur</p>
                </div>
              </div>
              <button onClick={signOut}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all hover:bg-red-500/20"
                style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span>⎋</span> Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={signOut}
              className="w-full flex items-center justify-center py-2.5 rounded-xl transition-all hover:bg-red-500/10"
              style={{ color: '#ef4444' }}>
              <span style={{ fontSize: '16px' }}>⎋</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}