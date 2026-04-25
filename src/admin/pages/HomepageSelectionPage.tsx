// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import { supabase } from '../../lib/supabase'

export default function HomepageSelectionPage() {
  const { onMenuClick } = useOutletContext()
  const [products, setProducts] = useState([])
  const [cooperatives, setCooperatives] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState(0)

  const loadData = async () => {
    setLoading(true)
    const [{ data: prods }, { data: coops }] = await Promise.all([
      supabase.from('products').select('id, name_en, name_ar, is_featured, order_index, image').order('order_index').order('created_at', { ascending: false }),
      supabase.from('cooperatives').select('id, name_en, name_ar, is_featured, order_index, image').order('order_index').order('created_at', { ascending: false }),
    ])
    setProducts(prods ?? [])
    setCooperatives(coops ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const updateItem = (table, id, field, value) => {
    if (table === 'products') setProducts(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
    else setCooperatives(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const saveAll = async () => {
    setSaving(true)
    const productUpdates = products.map(item =>
      supabase.from('products').update({ is_featured: !!item.is_featured, order_index: Number(item.order_index) || 0 }).eq('id', item.id)
    )
    const coopUpdates = cooperatives.map(item =>
      supabase.from('cooperatives').update({ is_featured: !!item.is_featured, order_index: Number(item.order_index) || 0 }).eq('id', item.id)
    )
    await Promise.all([...productUpdates, ...coopUpdates])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const featuredProducts = products.filter(i => i.is_featured).length
  const featuredCoops = cooperatives.filter(i => i.is_featured).length

  const TABS = ['Produits vedettes', 'Coopératives vedettes']
  const currentData = tab === 0 ? products : cooperatives
  const currentTable = tab === 0 ? 'products' : 'cooperatives'
  const featuredCount = tab === 0 ? featuredProducts : featuredCoops

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AdminHeader
        title="Sélection accueil"
        subtitle="Gérer les éléments affichés sur la page d'accueil"
        onMenuClick={onMenuClick}
        action={
          <button onClick={saveAll} disabled={saving || loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px', borderRadius: '12px', border: 'none',
              background: saved ? 'rgba(74,222,128,0.2)' : 'linear-gradient(135deg, #e8c547, #c9a227)',
              color: saved ? '#4ade80' : '#0f172a',
              fontWeight: 700, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1, transition: 'all 0.2s',
            }}>
            {saving ? '⏳ Sauvegarde...' : saved ? '✓ Enregistré' : '💾 Enregistrer'}
          </button>
        }
      />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Produits vedettes', value: featuredProducts, total: products.length, color: '#60a5fa', icon: '📦' },
            { label: 'Coopératives vedettes', value: featuredCoops, total: cooperatives.length, color: '#4ade80', icon: '🤝' },
            { label: 'Total produits', value: products.length, color: '#e8c547', icon: '🗂️' },
            { label: 'Total coopératives', value: cooperatives.length, color: '#a78bfa', icon: '📋' },
          ].map((s, i) => (
            <div key={i} style={{
              borderRadius: '16px', padding: '16px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                {s.total && (
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: s.color + '15', color: s.color }}>
                    / {s.total}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 2px', fontFamily: 'monospace' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div style={{ borderRadius: '14px', padding: '14px 18px', background: 'rgba(232,197,71,0.05)', border: '1px solid rgba(232,197,71,0.15)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
            Activez <strong style={{ color: '#e8c547' }}>Mis en avant</strong> pour afficher un élément sur la page d'accueil.
            Utilisez <strong style={{ color: '#e8c547' }}>Ordre</strong> pour contrôler la position (0 = premier).
            N'oubliez pas de cliquer sur <strong style={{ color: '#e8c547' }}>Enregistrer</strong>.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '12px', width: 'fit-content', background: 'rgba(255,255,255,0.05)' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.15s',
              background: tab === i ? '#e8c547' : 'transparent',
              color: tab === i ? '#0f172a' : 'rgba(255,255,255,0.4)',
            }}>
              {t}
              <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
                ({tab === i ? featuredCount : (i === 0 ? featuredProducts : featuredCoops)})
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px' }}>
            {['Nom', 'Statut', 'Mis en avant', 'Ordre'].map(h => (
              <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(232,197,71,0.2)', borderTopColor: '#e8c547', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : currentData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              Aucun élément
            </div>
          ) : (
            currentData.map((item, idx) => (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px',
                gap: '0', padding: '14px 20px', alignItems: 'center',
                borderBottom: idx < currentData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: item.is_featured ? 'rgba(232,197,71,0.03)' : 'transparent',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = item.is_featured ? 'rgba(232,197,71,0.03)' : 'transparent'}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {item.image
                    ? <img src={item.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                        {tab === 0 ? '📦' : '🤝'}
                      </div>
                  }
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: item.is_featured ? '#fff' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name_en || 'Sans nom'}
                    </p>
                    {item.name_ar && (
                      <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name_ar}</p>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    background: item.is_featured ? 'rgba(232,197,71,0.12)' : 'rgba(255,255,255,0.05)',
                    color: item.is_featured ? '#e8c547' : 'rgba(255,255,255,0.25)',
                  }}>
                    {item.is_featured ? '⭐ Vedette' : '— Normal'}
                  </span>
                </div>

                {/* Toggle */}
                <div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <div
                      onClick={() => updateItem(currentTable, item.id, 'is_featured', !item.is_featured)}
                      style={{
                        width: '36px', height: '20px', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                        background: item.is_featured ? '#e8c547' : 'rgba(255,255,255,0.1)',
                      }}>
                      <div style={{
                        position: 'absolute', top: '3px', width: '14px', height: '14px', borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                        left: item.is_featured ? '19px' : '3px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', color: item.is_featured ? '#e8c547' : 'rgba(255,255,255,0.3)' }}>
                      {item.is_featured ? 'Oui' : 'Non'}
                    </span>
                  </label>
                </div>

                {/* Order */}
                <div>
                  <input
                    type="number" min="0"
                    value={item.order_index ?? 0}
                    onChange={e => updateItem(currentTable, item.id, 'order_index', e.target.value)}
                    style={{
                      width: '64px', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', outline: 'none',
                      textAlign: 'center',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(232,197,71,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom save */}
        {!loading && currentData.length > 5 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={saveAll} disabled={saving}
              style={{
                padding: '10px 24px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #e8c547, #c9a227)',
                color: '#0f172a', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              }}>
              {saving ? '⏳ Sauvegarde...' : '💾 Enregistrer les modifications'}
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}