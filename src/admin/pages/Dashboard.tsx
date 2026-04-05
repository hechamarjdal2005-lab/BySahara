// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import { supabase } from '../../lib/supabase'

function MiniBar({ data, color }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '28px' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: '2px',
          background: color,
          opacity: 0.4 + (i / data.length) * 0.6,
          height: `${Math.max((v / max) * 100, 8)}%`,
          transition: 'height 0.6s ease',
        }} />
      ))}
    </div>
  )
}

function StatCard({ label, value, icon, color, spark, trend, link }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const target = parseInt(value) || 0
    let frame
    const animate = (start, ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / 800, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) frame = requestAnimationFrame(ts => animate(start, ts))
      else setCount(target)
    }
    frame = requestAnimationFrame(ts => animate(null, ts))
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <Link to={link || '#'} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '18px',
        cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s',
        position: 'relative', overflow: 'hidden',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color + '40' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '50%', background: color + '08', transform: 'translate(20px, -20px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            {icon}
          </div>
          {spark && <MiniBar data={spark} color={color} />}
        </div>
        <p style={{ fontSize: '26px', fontWeight: '700', color: '#fff', margin: '0 0 2px', fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {count.toLocaleString()}
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>{label}</p>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: trend >= 0 ? '#4ade80' : '#f87171' }}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>ce mois</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { onMenuClick } = useOutletContext()
  const [stats, setStats] = useState({ products: 0, cooperatives: 0, categories: 0, partners: 0, reviews: 0, messages: 0, unread: 0, packs: 0, orders: 0, pendingOrders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [msgByDay, setMsgByDay] = useState([0,0,0,0,0,0,0])
  const [msgLabels, setMsgLabels] = useState(['L','M','M','J','V','S','D'])
  const [ordersByDay, setOrdersByDay] = useState([0,0,0,0,0,0,0])
  const [reviewDist, setReviewDist] = useState([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const barChartRef = useRef(null)
  const donutRef = useRef(null)
  const chartInstanceRef = useRef(null)
  const barInstanceRef = useRef(null)
  const donutInstanceRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const [
        { count: products }, { count: cooperatives }, { count: categories },
        { count: partners }, { count: reviews }, { count: messages },
        { count: unread }, { count: packs }, { count: orders },
        { count: pendingOrders }, { data: recentMsgs }, { data: allReviews },
        { data: allMessages }, { data: allOrders }, { data: featuredProds },
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('cooperatives').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('packs').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('reviews').select('rating'),
        supabase.from('contact_messages').select('created_at').order('created_at', { ascending: false }).limit(30),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('name_en, image, price').eq('is_featured', true).limit(4),
      ])

      const revenue = (allOrders ?? []).reduce((s, o) => s + (o.total || 0), 0)
      setStats({ products: products ?? 0, cooperatives: cooperatives ?? 0, categories: categories ?? 0, partners: partners ?? 0, reviews: reviews ?? 0, messages: messages ?? 0, unread: unread ?? 0, packs: packs ?? 0, orders: orders ?? 0, pendingOrders: pendingOrders ?? 0, revenue })
      setRecentOrders(allOrders ?? [])
      setTopProducts(featuredProds ?? [])

      const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d })
      const labels = days.map(d => d.toLocaleDateString('fr-FR', { weekday: 'short' }))
      setMsgLabels(labels)
      setMsgByDay(days.map(d => (allMessages ?? []).filter(m => m.created_at?.slice(0, 10) === d.toISOString().slice(0, 10)).length))
      setOrdersByDay(days.map(d => (allOrders ?? []).filter(o => o.created_at?.slice(0, 10) === d.toISOString().slice(0, 10)).length))
      setReviewDist([5, 4, 3, 2, 1].map(r => ({ r, count: (allReviews ?? []).filter(rv => Math.round(rv.rating) === r).length })))
      setLoading(false)
    }
    load()
  }, [])

  // Chart.js charts
  useEffect(() => {
    if (loading || !chartRef.current) return
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy()
      chartInstanceRef.current = new window.Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: msgLabels,
          datasets: [
            {
              label: 'Messages',
              data: msgByDay,
              borderColor: '#e8c547',
              backgroundColor: 'rgba(232,197,71,0.08)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#e8c547',
              pointRadius: 4,
              borderWidth: 2,
            },
            {
              label: 'Commandes',
              data: ordersByDay,
              borderColor: '#4ade80',
              backgroundColor: 'rgba(74,222,128,0.05)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#4ade80',
              pointRadius: 4,
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, stepSize: 1 }, beginAtZero: true }
          }
        }
      })

      if (barInstanceRef.current) barInstanceRef.current.destroy()
      if (barChartRef.current) {
        barInstanceRef.current = new window.Chart(barChartRef.current, {
          type: 'bar',
          data: {
            labels: ['5★', '4★', '3★', '2★', '1★'],
            datasets: [{
              data: reviewDist.map(r => r.count),
              backgroundColor: ['#4ade80', '#86efac', '#e8c547', '#fb923c', '#f87171'],
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, stepSize: 1 }, beginAtZero: true }
            }
          }
        })
      }
    }
    document.head.appendChild(script)
    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); if (barInstanceRef.current) barInstanceRef.current.destroy() }
  }, [loading, msgByDay, ordersByDay, reviewDist])

  const STATUS_CONFIG = {
    pending:   { label: 'En attente', color: '#e8c547' },
    confirmed: { label: 'Confirmé',  color: '#4ade80' },
    shipping:  { label: 'En cours',  color: '#60a5fa' },
    delivered: { label: 'Livré',     color: '#a78bfa' },
    cancelled: { label: 'Annulé',    color: '#f87171' },
  }

  const STAT_CARDS = [
    { label: 'Commandes', value: stats.orders, icon: '🛍️', color: '#4ade80', spark: [1,2,3,2,4,3,stats.orders], trend: 12, link: '/admin/orders' },
    { label: 'En attente', value: stats.pendingOrders, icon: '⏳', color: '#e8c547', spark: [0,1,1,2,1,2,stats.pendingOrders], trend: stats.pendingOrders > 0 ? 5 : 0, link: '/admin/orders' },
    { label: 'Produits', value: stats.products, icon: '📦', color: '#60a5fa', spark: [3,5,4,7,6,8,stats.products], trend: 8, link: '/admin/products' },
    { label: 'Coopératives', value: stats.cooperatives, icon: '🤝', color: '#a78bfa', spark: [1,2,2,3,3,4,stats.cooperatives], trend: 0, link: '/admin/cooperatives' },
    { label: 'Avis clients', value: stats.reviews, icon: '⭐', color: '#fb923c', spark: [5,8,6,10,9,12,stats.reviews], trend: 15, link: '/admin/products' },
    { label: 'Messages', value: stats.messages, icon: '✉️', color: '#f472b6', spark: [1,3,2,4,3,5,stats.messages], trend: stats.unread > 0 ? stats.unread * 10 : 0, link: '/admin/messages' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#0a0e1a' }}>
      <AdminHeader title="Tableau de bord" subtitle={new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} onMenuClick={onMenuClick} />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Welcome */}
        <div style={{ borderRadius: '16px', padding: '20px 24px', background: 'linear-gradient(135deg, #1a2400, #2d3a00)', border: '1px solid rgba(232,197,71,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#e8c547', opacity: 0.8, margin: '0 0 4px' }}>
              {new Date().getHours() < 12 ? '🌅 Bonjour' : new Date().getHours() < 18 ? '☀️ Bon après-midi' : '🌙 Bonsoir'}
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 4px', fontFamily: "'Syne', sans-serif" }}>BySahara Admin</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              {stats.pendingOrders > 0 ? `⚠️ ${stats.pendingOrders} commande(s) en attente` : '✅ Tout est à jour'}
              {stats.unread > 0 ? ` · ${stats.unread} message(s) non lu(s)` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', padding: '10px 16px', borderRadius: '12px', background: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.2)' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#e8c547', margin: 0 }}>{stats.revenue.toFixed(0)} MAD</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Revenu total</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {STAT_CARDS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Line chart */}
          <div style={{ borderRadius: '16px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0, fontFamily: "'Syne', sans-serif" }}>Activité — 7 jours</h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>Messages & Commandes</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[['#e8c547', 'Messages'], ['#4ade80', 'Commandes']].map(([c, l]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', height: '160px' }}>
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Bar chart ratings */}
          <div style={{ borderRadius: '16px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0, fontFamily: "'Syne', sans-serif" }}>Avis clients</h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>Distribution par note</p>
            </div>
            <div style={{ position: 'relative', height: '160px' }}>
              <canvas ref={barChartRef} />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Recent orders */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0, fontFamily: "'Syne', sans-serif" }}>Dernières commandes</h3>
              <Link to="/admin/orders" style={{ fontSize: '11px', color: '#e8c547', textDecoration: 'none' }}>Voir tout →</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>📦 Aucune commande</div>
            ) : (
              <div>
                {recentOrders.map(order => {
                  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                  return (
                    <Link key={order.id} to="/admin/orders" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(232,197,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#e8c547', flexShrink: 0 }}>
                        {order.customer_name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.customer_name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{order.customer_phone}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#e8c547', margin: 0 }}>{order.total} MAD</p>
                        <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: st.color + '20', color: st.color, fontWeight: '600' }}>{st.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top products + Quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Top products */}
            <div style={{ borderRadius: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0, fontFamily: "'Syne', sans-serif" }}>Produits vedettes</h3>
                <Link to="/admin/products" style={{ fontSize: '11px', color: '#e8c547', textDecoration: 'none' }}>Gérer →</Link>
              </div>
              {topProducts.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '16px 0' }}>Aucun produit vedette</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {topProducts.slice(0, 4).map((p, i) => (
                    <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {p.image && <img src={p.image} alt="" style={{ width: '100%', height: '60px', objectFit: 'cover' }} />}
                      <div style={{ padding: '8px' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name_en}</p>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#e8c547', margin: 0 }}>{p.price} MAD</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ borderRadius: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 12px', fontFamily: "'Syne', sans-serif" }}>Actions rapides</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { label: 'Produit', icon: '📦', path: '/admin/products', color: '#60a5fa' },
                  { label: 'Pack', icon: '🎁', path: '/admin/packs', color: '#e8c547' },
                  { label: 'Médias', icon: '🖼️', path: '/admin/media', color: '#a78bfa' },
                  { label: 'Messages', icon: '✉️', path: '/admin/messages', color: '#f472b6' },
                  { label: 'Coopérative', icon: '🤝', path: '/admin/cooperatives', color: '#4ade80' },
                  { label: 'Paramètres', icon: '⚙️', path: '/admin/settings', color: '#94a3b8' },
                ].map((a, i) => (
                  <Link key={i} to={a.path} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 6px', borderRadius: '10px', background: a.color + '10', border: `1px solid ${a.color}20`, transition: 'transform 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <span style={{ fontSize: '18px' }}>{a.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: '500', color: a.color, textAlign: 'center' }}>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}