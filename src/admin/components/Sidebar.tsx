import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const menuItems = [
  { label: 'Tableau de bord', icon: '📊', path: '/admin' },
  { label: 'Produits', icon: '📦', path: '/admin/products' },
  { label: 'Catégories', icon: '🏷️', path: '/admin/categories' },
  { label: 'Coopératives', icon: '🤝', path: '/admin/cooperatives' },
  { label: 'Médias & Banners', icon: '🖼️', path: '/admin/media' },
  { label: 'Partenaires', icon: '🌟', path: '/admin/partners' },
  { label: 'Contenu des pages', icon: '📄', path: '/admin/content' },
  { label: 'Pied de page', icon: '🔗', path: '/admin/footer' },
  { label: 'Paramètres', icon: '⚙️', path: '/admin/settings' },
]

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { signOut, user } = useAuth()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        bg-[#0f172a] border-r border-white/5
        transition-transform duration-300
        w-64
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8c547] to-[#c9a227] flex items-center justify-center text-xl shadow-lg">
            🌿
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">BySahara</p>
            <p className="text-gray-500 text-xs mt-0.5">Administration</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-500 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#e8c547]/20 flex items-center justify-center text-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.email}</p>
              <p className="text-gray-500 text-xs">Administrateur</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <span>🚪</span>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}