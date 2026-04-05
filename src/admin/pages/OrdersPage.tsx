// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { supabase } from '../../lib/supabase'

const STATUS_CONFIG = {
  pending:    { label: 'En attente',  color: '#e8c547', bg: 'rgba(232,197,71,0.1)' },
  confirmed:  { label: 'Confirmé',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  shipping:   { label: 'En cours',   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  delivered:  { label: 'Livré',      color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  cancelled:  { label: 'Annulé',     color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function OrdersPage() {
  const { onMenuClick } = useOutletContext()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()

    // Real-time new orders
    const channel = supabase.channel('orders-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  const openOrder = async (order) => {
    setSelected(order)
    if (!order.is_seen) {
      await supabase.from('orders').update({ is_seen: true }).eq('id', order.id)
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, is_seen: true } : o))
    }
  }

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  const handleDelete = async () => {
    setSaving(true)
    await supabase.from('orders').delete().eq('id', deleteTarget.id)
    setOrders(prev => prev.filter(o => o.id !== deleteTarget.id))
    if (selected?.id === deleteTarget.id) setSelected(null)
    setSaving(false)
    setDeleteTarget(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const unseen = orders.filter(o => !o.is_seen).length

  return (
    <div>
      <AdminHeader
        title="Commandes"
        subtitle={unseen > 0 ? `${unseen} nouvelle(s) commande(s)` : 'Toutes les commandes'}
        onMenuClick={onMenuClick}
      />

      <div className="p-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[['all', 'Toutes'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={filter === key
                ? { background: '#e8c547', color: '#0a0e1a' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {label}
              {key !== 'all' && (
                <span className="ml-1.5" style={{ opacity: 0.7 }}>
                  ({orders.filter(o => o.status === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Orders list */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {filtered.length} commande(s)
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(232,197,71,0.2)', borderTopColor: '#e8c547' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <p className="text-3xl mb-2">📦</p>
                <p className="text-xs">Aucune commande</p>
              </div>
            ) : (
              <ul className="divide-y max-h-[600px] overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                {filtered.map(order => {
                  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                  return (
                    <li key={order.id} onClick={() => openOrder(order)}
                      className="px-4 py-3 cursor-pointer transition hover:bg-white/5"
                      style={selected?.id === order.id ? { background: 'rgba(255,255,255,0.06)' } : {}}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {!order.is_seen && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#e8c547' }} />}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: order.is_seen ? 'rgba(255,255,255,0.6)' : '#fff' }}>
                              {order.customer_name}
                            </p>
                            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                              📞 {order.customer_phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs font-bold" style={{ color: '#e8c547' }}>{order.total} MAD</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)', paddingLeft: order.is_seen ? 0 : '16px' }}>
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Order detail */}
          <div className="lg:col-span-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full py-20" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <p className="text-4xl mb-3">📦</p>
                <p className="text-sm">Sélectionnez une commande</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg">{selected.customer_name}</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(selected.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={() => setDeleteTarget(selected)}
                    className="text-xs px-3 py-1.5 rounded-lg transition hover:opacity-80"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    Supprimer
                  </button>
                </div>

                {/* Client info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '👤', label: 'Client', value: selected.customer_name },
                    { icon: '📞', label: 'Téléphone', value: selected.customer_phone },
                    { icon: '📍', label: 'Adresse', value: selected.customer_address },
                  ].map(info => (
                    <div key={info.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{info.icon} {info.label}</p>
                      <p className="text-sm font-medium text-white">{info.value}</p>
                    </div>
                  ))}
                </div>

                {/* Items */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-4 py-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Articles ({(selected.items ?? []).length})
                    </p>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {(selected.items ?? []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.name_en || item.name_ar}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>x{item.quantity} × {item.price} MAD</p>
                        </div>
                        <p className="text-sm font-bold flex-shrink-0" style={{ color: '#e8c547' }}>{item.subtotal} MAD</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(232,197,71,0.05)' }}>
                    <p className="text-sm font-bold text-white">Total</p>
                    <p className="text-lg font-bold" style={{ color: '#e8c547' }}>{selected.total} MAD</p>
                  </div>
                </div>

                {/* Status + WhatsApp */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1">
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Changer le statut</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <button key={key} onClick={() => updateStatus(selected.id, key)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium transition hover:opacity-80"
                          style={{
                            background: selected.status === key ? val.bg : 'rgba(255,255,255,0.05)',
                            color: selected.status === key ? val.color : 'rgba(255,255,255,0.4)',
                            border: selected.status === key ? `1px solid ${val.color}40` : '1px solid rgba(255,255,255,0.08)',
                          }}>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <a href={`https://wa.me/${selected.customer_phone?.replace(/\D/g, '').replace(/^0/, '212')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff' }}>
                    💬 Contacter via WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la commande"
        message="Cette commande sera définitivement supprimée."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  )
}