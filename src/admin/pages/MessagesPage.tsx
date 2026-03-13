import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { useCrud } from '../hooks/useCrud'
import { supabase } from '../../lib/supabase'

export default function MessagesPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const messages = useCrud<any>('contact_messages', 'created_at')
  const [selected, setSelected] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const unread = messages.data.filter(m => !m.is_read).length

  const openMessage = async (msg: any) => {
    setSelected(msg)
    if (!msg.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
      messages.refetch()
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    await messages.remove(deleteTarget.id)
    if (selected?.id === deleteTarget.id) setSelected(null)
    setSaving(false)
    setDeleteTarget(null)
  }

  return (
    <div>
      <AdminHeader
        title="Messages"
        subtitle={unread > 0 ? `${unread} message(s) non lu(s)` : 'Tous les messages lus'}
        onMenuClick={onMenuClick}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Liste */}
          <div className="lg:col-span-1 bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {messages.data.length} message(s)
              </p>
            </div>

            {messages.loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-4 border-[#e8c547]/20 border-t-[#e8c547] animate-spin" />
              </div>
            ) : messages.data.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">Aucun message</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {messages.data.map(msg => (
                  <li
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`px-4 py-3 cursor-pointer transition hover:bg-white/5 ${selected?.id === msg.id ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#e8c547] flex-shrink-0" />
                        )}
                        <p className={`text-sm truncate ${!msg.is_read ? 'text-white font-semibold' : 'text-gray-400'}`}>
                          {msg.name}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg) }}
                        className="text-gray-600 hover:text-red-400 transition text-xs flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5 ml-4">{msg.subject}</p>
                    <p className="text-xs text-gray-600 mt-0.5 ml-4">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Détail */}
          <div className="lg:col-span-2 bg-[#0f172a]/60 border border-white/5 rounded-2xl">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
                <p className="text-4xl mb-3">✉️</p>
                <p className="text-sm">Sélectionnez un message</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg">{selected.subject}</h2>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(selected.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(selected)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    Supprimer
                  </button>
                </div>

                {/* Sender info */}
                <div className="flex gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8c547]/10 flex items-center justify-center text-[#e8c547] font-bold flex-shrink-0">
                    {selected.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-[#e8c547] text-xs hover:underline">
                      {selected.email}
                    </a>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Reply button */}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition"
                >
                  ✉️ Répondre par email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le message"
        message="Ce message sera définitivement supprimé."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  )
}