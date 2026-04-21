// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'
import { supabase } from '../../lib/supabase'

const emptyPack = {
  id: '', cooperative_id: '', cooperative_name: '',
  name: '', name_ar: '', description: '', description_ar: '',
  image_url: '', pack_price: '', total_original_price: '', savings: '',
  badge: '', badge_ar: '', stock: '', order_index: 0, is_active: true,
}

const selectStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 12px) center',
}

export default function PacksPage() {
  const { onMenuClick } = useOutletContext()
  const packs = useCrud('packs', 'order_index')

  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyPack)
  const [packItems, setPackItems] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  // Items modal
  const [itemsModal, setItemsModal] = useState(false)
  const [selectedPack, setSelectedPack] = useState(null)
  const [currentItems, setCurrentItems] = useState([])
  const [editingItemIdx, setEditingItemIdx] = useState(null)

  // Product selection modal
  const [productPickerOpen, setProductPickerOpen] = useState(false)
  const [pickerFilter, setPickerFilter] = useState('')

  // Data
  const [cooperatives, setCooperatives] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    supabase.from('cooperatives').select('id, name_en, name_ar').order('name_en')
      .then(({ data }) => setCooperatives(data ?? []))
    supabase.from('products').select('id, name_en, name_ar, image, price, cooperative_id, category').order('name_en')
      .then(({ data }) => setAllProducts(data ?? []))
  }, [])

  // Filter products when cooperative changes
  useEffect(() => {
    if (form.cooperative_id) {
      setFilteredProducts(allProducts.filter(p => p.cooperative_id === form.cooperative_id))
    } else {
      setFilteredProducts(allProducts)
    }
  }, [form.cooperative_id, allProducts])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toSlug = (str) => 'pack-' + str.toLowerCase().trim()
    .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const openCreate = () => {
    setEditing(null)
    setForm(emptyPack)
    setPackItems([])
    setModal(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm(row)
    setPackItems(row.items ?? [])
    setModal(true)
  }

  const openItems = (pack) => {
    setSelectedPack(pack)
    setCurrentItems(pack.items ?? [])
    setEditingItemIdx(null)
    setItemsModal(true)
  }

  // ── Cooperative change ──
  const handleCoopChange = (coopId) => {
    const coop = cooperatives.find(c => c.id === coopId)
    set('cooperative_id', coopId)
    set('cooperative_name', coop ? coop.name_en : '')
    // Clear items if cooperative changed
    setPackItems([])
  }

  // ── Add product to pack items ──
  const addProductToItems = (product) => {
    const existing = packItems.find(i => i.product_id === product.id)
    if (existing) {
      setPackItems(prev => prev.map(i =>
        i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setPackItems(prev => [...prev, {
        product_id: product.id,
        product_name: product.name_en,
        product_name_ar: product.name_ar,
        image: product.image,
        quantity: 1,
        unit: '',
        is_free: false,
        original_price: product.price,
        pack_price: product.price,
      }])
    }
    setProductPickerOpen(false)
  }

  const updateItem = (idx, key, val) => {
    setPackItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item))
  }

  const removeItem = (idx) => {
    setPackItems(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Save items to existing pack ──
  const saveItems = async () => {
    setSaving(true)
    await supabase.from('packs').update({ items: currentItems }).eq('id', selectedPack.id)
    packs.refetch()
    setSaving(false)
    setItemsModal(false)
  }

  // ── Auto-calculate savings ──
  const calcSavings = () => {
    const original = parseFloat(form.total_original_price) || 0
    const packP = parseFloat(form.pack_price) || 0
    if (original > 0 && packP > 0) set('savings', (original - packP).toFixed(2))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      items: packItems,
      pack_price: parseFloat(form.pack_price) || 0,
      total_original_price: parseFloat(form.total_original_price) || packItems.reduce((s, i) => s + (i.original_price * i.quantity), 0),
      savings: parseFloat(form.savings) || 0,
      stock: parseInt(form.stock) || 0,
      order_index: parseInt(form.order_index) || 0,
    }
    if (editing) await packs.update(editing.id, payload)
    else await packs.create(payload)
    setSaving(false)
    setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    await packs.remove(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
  }

  const pickerProducts = (productPickerOpen === 'items-modal' ? currentItems : packItems)
  const pickerFiltered = filteredProducts.filter(p => {
    if (!pickerFilter) return true
    return p.name_en.toLowerCase().includes(pickerFilter.toLowerCase()) ||
           p.name_ar.includes(pickerFilter)
  })

  return (
    <div>
      <AdminHeader title="Packs & Offres" subtitle="Gérer les packs et offres groupées" onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
            ➕ Nouveau pack
          </button>
        }
      />

      <div className="p-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <DataTable
            data={packs.data} loading={packs.loading}
            onEdit={openEdit} onDelete={setDeleteTarget}
            onToggle={row => packs.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'image_url', label: 'Image', render: row => row.image_url
                ? <img src={row.image_url} alt="" className="w-12 h-10 rounded-lg object-cover" />
                : <div className="w-12 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>🎁</div>
              },
              { key: 'name', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'pack_price', label: 'Prix pack', render: row => `${row.pack_price} MAD` },
              { key: 'savings', label: 'Économie', render: row => <span style={{ color: '#4ade80' }}>-{row.savings} MAD</span> },
              { key: 'stock', label: 'Stock' },
              { key: 'cooperative_name', label: 'Coopérative', render: row => row.cooperative_name
                ? <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{row.cooperative_name}</span>
                : <span style={{ color: 'rgba(255,255,255,0.2)' }}>Mixte</span>
              },
              { key: 'items', label: 'Articles', render: row => (
                <button onClick={() => openItems(row)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                  style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                  🛍️ {(row.items ?? []).length} article(s)
                </button>
              )},
            ]}
          />
        </div>
      </div>

      {/* ── Pack Form Modal ── */}
      <FormModal open={modal} title={editing ? 'Modifier le pack' : 'Nouveau pack'}
        onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>

        {/* Nom → auto ID */}
        <Grid2>
          <Field label="Nom (FR)">
            <Input value={form.name} onChange={e => { set('name', e.target.value); if (!editing) set('id', toSlug(e.target.value)) }} required />
          </Field>
          <Field label="Nom (AR)">
            <Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required />
          </Field>
        </Grid2>

        <Field label="ID (auto)">
          <div className="relative">
            <Input value={form.id} onChange={e => set('id', e.target.value)} required disabled={!!editing} />
            {!editing && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>auto ✓</span>}
          </div>
        </Field>

        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description} onChange={e => set('description', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>

        {/* Coopérative dropdown */}
        <Field label="Coopérative (optionnel — laisser vide pour pack mixte)">
          <select value={form.cooperative_id} onChange={e => handleCoopChange(e.target.value)} style={selectStyle}>
            <option value="" style={{ background: '#1e293b' }}>— Pack mixte (toutes coopératives) —</option>
            {cooperatives.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>
                {c.name_en} / {c.name_ar}
              </option>
            ))}
          </select>
        </Field>

        {/* Articles */}
        <Field label={`Articles du pack (${packItems.length})`}>
          <div className="space-y-2">
            {/* Product picker button */}
            <button type="button" onClick={() => { setProductPickerOpen('main'); setPickerFilter('') }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-80"
              style={{ background: 'rgba(232,197,71,0.1)', color: '#e8c547', border: '1px dashed rgba(232,197,71,0.3)' }}>
              ➕ Ajouter un produit
              {form.cooperative_id && <span className="text-xs opacity-60">(filtrés par coopérative)</span>}
            </button>

            {/* Items list */}
            {packItems.length === 0 ? (
              <p className="text-xs text-center py-3" style={{ color: 'rgba(255,255,255,0.2)' }}>Aucun article — cliquez sur Ajouter</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {packItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.product_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="number" value={item.quantity} min="1"
                          onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-12 text-xs text-center rounded-lg py-0.5"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
                        <input type="number" value={item.pack_price} min="0"
                          onChange={e => updateItem(idx, 'pack_price', parseFloat(e.target.value) || 0)}
                          className="w-16 text-xs text-center rounded-lg py-0.5"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>MAD</span>
                        <label className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: '#4ade80' }}>
                          <input type="checkbox" checked={item.is_free}
                            onChange={e => { updateItem(idx, 'is_free', e.target.checked); if (e.target.checked) updateItem(idx, 'pack_price', 0) }} />
                          🎁 Gratuit
                        </label>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeItem(idx)}
                      className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>

        <Grid2>
          <Field label="Prix pack (MAD)">
            <Input type="number" value={form.pack_price} onChange={e => set('pack_price', e.target.value)} onBlur={calcSavings} required />
          </Field>
          <Field label="Prix original (MAD)">
            <Input type="number" value={form.total_original_price} onChange={e => set('total_original_price', e.target.value)} onBlur={calcSavings}
              placeholder={packItems.reduce((s, i) => s + (i.original_price * i.quantity), 0) || ''} />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Économie (MAD) — auto">
            <Input type="number" value={form.savings} onChange={e => set('savings', e.target.value)} />
          </Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge (FR)"><Input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="Best Value, New..." /></Field>
          <Field label="Badge (AR)"><Input value={form.badge_ar} onChange={e => set('badge_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image du pack"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="packs" /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index} onChange={e => set('order_index', e.target.value)} /></Field>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} /> Actif
        </label>
      </FormModal>

      {/* ── Product Picker Modal (main form) ── */}
      {productPickerOpen === 'main' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setProductPickerOpen(false)} />
          <div className="relative rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '70vh', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h3 className="text-white font-semibold">Choisir un produit</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {form.cooperative_id ? `Filtrés par: ${cooperatives.find(c => c.id === form.cooperative_id)?.name_en}` : 'Tous les produits'}
                </p>
              </div>
              <button onClick={() => setProductPickerOpen(false)} className="text-gray-500 hover:text-white text-xl transition">✕</button>
            </div>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="text" value={pickerFilter} onChange={e => setPickerFilter(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {pickerFiltered.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {form.cooperative_id ? 'Aucun produit pour cette coopérative' : 'Aucun produit trouvé'}
                </p>
              ) : pickerFiltered.map(p => (
                <button key={p.id} type="button" onClick={() => addProductToItems(p)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl transition hover:bg-white/10 text-left"
                  style={{ background: packItems.find(i => i.product_id === p.id) ? 'rgba(232,197,71,0.1)' : 'transparent' }}>
                  {p.image
                    ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>📦</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name_en}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.name_ar} — {p.price} MAD</p>
                  </div>
                  {packItems.find(i => i.product_id === p.id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(232,197,71,0.2)', color: '#e8c547' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Items Modal (for existing pack) ── */}
      {itemsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setItemsModal(false)} />
          <div className="relative rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h2 className="text-white font-semibold text-lg">Articles — {selectedPack?.name}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {selectedPack?.cooperative_name || 'Pack mixte'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setProductPickerOpen('items-modal'); setPickerFilter('') }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
                  ➕ Ajouter produit
                </button>
                <button onClick={() => setItemsModal(false)} className="text-gray-500 hover:text-white transition text-xl">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {currentItems.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <p className="text-3xl mb-3">📦</p>
                  <p className="text-sm">Aucun article — cliquez sur Ajouter</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{item.product_name}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Qté:</span>
                            <input type="number" value={item.quantity} min="1"
                              onChange={e => setCurrentItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: parseInt(e.target.value) || 1 } : it))}
                              className="w-12 text-xs text-center rounded-lg py-0.5"
                              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Prix:</span>
                            <input type="number" value={item.pack_price} min="0"
                              onChange={e => setCurrentItems(prev => prev.map((it, i) => i === idx ? { ...it, pack_price: parseFloat(e.target.value) || 0 } : it))}
                              className="w-16 text-xs text-center rounded-lg py-0.5"
                              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>MAD</span>
                          </div>
                          <label className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: '#4ade80' }}>
                            <input type="checkbox" checked={item.is_free}
                              onChange={e => setCurrentItems(prev => prev.map((it, i) => i === idx ? { ...it, is_free: e.target.checked, pack_price: e.target.checked ? 0 : it.original_price } : it))} />
                            🎁 Gratuit
                          </label>
                        </div>
                      </div>
                      <button onClick={() => setCurrentItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => setItemsModal(false)} className="flex-1 py-2.5 rounded-xl text-sm transition"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>Annuler</button>
              <button onClick={saveItems} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Picker (items modal) ── */}
      {productPickerOpen === 'items-modal' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setProductPickerOpen(false)} />
          <div className="relative rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '70vh', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-white font-semibold">Ajouter un produit</h3>
              <button onClick={() => setProductPickerOpen(false)} className="text-gray-500 hover:text-white text-xl transition">✕</button>
            </div>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="text" value={pickerFilter} onChange={e => setPickerFilter(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {(selectedPack?.cooperative_id
                ? allProducts.filter(p => p.cooperative_id === selectedPack.cooperative_id)
                : allProducts
              ).filter(p => !pickerFilter || p.name_en.toLowerCase().includes(pickerFilter.toLowerCase()))
               .map(p => (
                <button key={p.id} type="button"
                  onClick={() => {
                    const existing = currentItems.find(i => i.product_id === p.id)
                    if (existing) {
                      setCurrentItems(prev => prev.map(i => i.product_id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
                    } else {
                      setCurrentItems(prev => [...prev, {
                        product_id: p.id, product_name: p.name_en, product_name_ar: p.name_ar,
                        image: p.image, quantity: 1, unit: '', is_free: false,
                        original_price: p.price, pack_price: p.price,
                      }])
                    }
                    setProductPickerOpen(false)
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl transition hover:bg-white/10 text-left">
                  {p.image
                    ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name_en}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.price} MAD</p>
                  </div>
                  {currentItems.find(i => i.product_id === p.id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,197,71,0.2)', color: '#e8c547' }}>✓ ajouté</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}