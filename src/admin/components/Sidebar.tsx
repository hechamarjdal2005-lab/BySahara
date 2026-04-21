// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../../lib/supabase'

const NAV = [
  { label: 'Tableau de bord',      emoji: '▦',  path: '/admin',                    end: true },
  { label: 'Commandes',            emoji: '🛍️', path: '/admin/orders',             badge: 'orders' },
  { label: 'Produits',             emoji: '📦', path: '/admin/products' },
  { label: 'Catégories',           emoji: '🏷️', path: '/admin/categories' },
  { label: 'Coopératives',         emoji: '🤝', path: '/admin/cooperatives' },
  { label: 'Sélection accueil',    emoji: '⭐', path: '/admin/homepage-selection' },
  { label: 'Packs & Offres',       emoji: '🎁', path: '/admin/packs' },
  { label: 'Médias',               emoji: '🖼️', path: '/admin/media' },
  { label: 'Partenaires',          emoji: '🌟', path: '/admin/partners' },
  { label: 'Messages',             emoji: '✉️', path: '/admin/messages',           badge: 'messages' },
  { label: 'Contenu',              emoji: '📄', path: '/admin/content' },
  { label: 'À propos',             emoji: '📖', path: '/admin/about' },
  { label: 'Pied de page',         emoji: '🔗', path: '/admin/footer' },
  { label: 'Paramètres',           emoji: '⚙️', path: '/admin/settings' },
]

export default function Sidebar({ open, setOpen, collapsed, setCollapsed }) {
  const { signOut, user } = useAuth()
  const [unreadMsgs, setUnreadMsgs] = useState(0)
  const [unseenOrders, setUnseenOrders] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const [{ count: msgs }, { count: orders }] = await Promise.all([
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('is_seen', false),
      ])
      setUnreadMsgs(msgs ?? 0)
      setUnseenOrders(orders ?? 0)
    }

    fetch()

    const ch = supabase.channel('sidebar-badges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetch)
      .subscribe()

    return () => supabase.removeChannel(ch)
  }, [])

  const getBadge = (key) => key === 'messages' ? unreadMsgs : key === 'orders' ? unseenOrders : 0

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 20,
            backdropFilter: 'blur(4px)',
            display: 'block',
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 30,
          width: collapsed ? '72px' : '240px',
          background: '#0d1117',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease, transform 0.25s ease',
          transform: open ? 'translateX(0)' : undefined,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            padding: collapsed ? '20px 0' : '20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e8c547, #c9a227)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(232,197,71,0.25)',
            }}
          >
            🌿
          </div>

          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: 0, fontFamily: "'Syne', sans-serif" }}>
                BySahara
              </p>
              <p style={{ fontSize: '10px', color: '#e8c547', margin: 0, opacity: 0.6 }}>
                Administration
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginLeft: 'auto',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              display: collapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
            className="hidden lg:flex"
          >
            ‹
          </button>

          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              style={{
                position: 'absolute',
                right: '-10px',
                top: '28px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#0d1117',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hidden lg:flex"
            >
              ›
            </button>
          )}

          <button
            onClick={() => setOpen(false)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            className="lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px', scrollbarWidth: 'none' }}>
          {!collapsed && (
            <p
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '8px 8px 4px',
              }}
            >
              Menu
            </p>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV.map((item) => {
              const badge = item.badge ? getBadge(item.badge) : 0

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: collapsed ? '10px' : '9px 10px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      position: 'relative',
                      background: isActive ? 'rgba(232,197,71,0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(232,197,71,0.15)' : '1px solid transparent',
                      transition: 'all 0.15s',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !collapsed && (
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '3px',
                              height: '18px',
                              borderRadius: '0 2px 2px 0',
                              background: '#e8c547',
                            }}
                          />
                        )}

                        <span style={{ fontSize: '15px', flexShrink: 0 }}>{item.emoji}</span>

                        {!collapsed && (
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: isActive ? '600' : '400',
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                              flex: 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.label}
                          </span>
                        )}

                        {badge > 0 && !collapsed && (
                          <span
                            style={{
                              minWidth: '18px',
                              height: '18px',
                              borderRadius: '9px',
                              background: '#ef4444',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0 4px',
                            }}
                          >
                            {badge > 9 ? '9+' : badge}
                          </span>
                        )}

                        {badge > 0 && collapsed && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#ef4444',
                            }}
                          />
                        )}

                        {collapsed && (
                          <span
                            style={{
                              position: 'absolute',
                              left: '100%',
                              marginLeft: '8px',
                              background: '#1e293b',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              whiteSpace: 'nowrap',
                              border: '1px solid rgba(255,255,255,0.08)',
                              opacity: 0,
                              pointerEvents: 'none',
                              transition: 'opacity 0.15s',
                              zIndex: 50,
                            }}
                            className="sidebar-tooltip"
                          >
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {!collapsed ? (
            <div
              style={{
                borderRadius: '10px',
                padding: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8c547, #c9a227)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#0a0e1a',
                    flexShrink: 0,
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase()}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.email}
                  </p>
                  <p style={{ fontSize: '10px', color: 'rgba(232,197,71,0.6)', margin: 0 }}>
                    Administrateur
                  </p>
                </div>
              </div>

              <button
                onClick={signOut}
                style={{
                  width: '100%',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.2)',
                  background: 'transparent',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ⎋ Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={signOut}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              ⎋
            </button>
          )}
        </div>
      </aside>

      <style>{`
        .sidebar-tooltip { opacity: 0 !important; }
        li:hover .sidebar-tooltip { opacity: 1 !important; }
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}