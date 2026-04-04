import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'
import { supabase } from '../../lib/supabase'

const TABS = ['Produits', 'Avis clients']

const emptyProduct = {
  name_en: '', name_ar: '', description_en: '', description_ar: '',
  price: '', image_url: '', category_id: '', cooperative_id: '',
  stock: '', is_active: true, is_featured: false,
}

const emptyVolume = {
  label_en: '', label_ar: '', value: '', unit: '', price: '', order_index: 0
}

export default function ProductsPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)

  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyProduct)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Volumes
  const [volumesModal, setVolumesModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [volumes, setVolumes] = useState<any[]>([])
  const [volumesLoading, setVolumesLoading] = useState(false)
  const [volumeModal, setVolumeModal] = useState(false)
  const [editingVolume, setEditingVolume] = useState<any>(null)
  const [volumeForm, setVolumeForm] = useState<any>(emptyVolume)
  const [deleteVolume, setDeleteVolume] = useState<any>(null)
  const [savingVolume, setSavingVolume] = useState(false)

  // Dropdown data
  const [categories, setCategories] = useState<any[]>([])
  const [cooperatives, setCooperatives] = useState<any[]>([])

  const products = useCrud<any>('products', 'created_at')
  const reviews = useCrud<any>('reviews', 'created_at')

  // Load categories & cooperatives
  useEffect(() => {
    supabase.from('categories').select('id, name_en, name_ar').eq('is_active', true).order('order_index')
      .then(({ data }) => setCategories(data ?? []))
    supabase.from('cooperatives').select('id, name_en, name_ar').order('name_en')
      .then(({ data }) => setCooperatives(data ?? []))
  }, [])

  const set = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }))
  const setVol = (key: string, val: any) => setVolumeForm((p: any) => ({ ...p, [key]: val }))

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  // Volumes
  const openVolumes = async (product: any) => {
    setSelectedProduct(product)
    setVolumesModal(true)
    setVolumesLoading(true)
    const { data } = await supabase.from('product_volumes').select('*').eq('product_id', product.id).order('order_index')
    setVolumes(data ?? [])
    setVolumesLoading(false)
  }

  const openCreateVolume = () => { setEditingVolume(null); setVolumeForm(emptyVolume); setVolumeModal(true) }
  const openEditVolume = (v: any) => { setEditingVolume(v); setVolumeForm(v); setVolumeModal(true) }

  const handleVolumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingVolume(true)
    const payload = {
      ...volumeForm,
      product_id: selectedProduct.id,
      value: parseFloat(volumeForm.value) || 0,
      price: parseFloat(volumeForm.price) || 0,
      order_index: parseInt(volumeForm.order_index) || 0,
    }
    if (editingVolume) {
      await supabase.from('product_volumes').update(payload).eq('id', editingVolume.id)
      setVolumes(prev => prev.map(v => v.id === editingVolume.id ? { ...v, ...payload } : v))
    } else {
      const { data } = await supabase.from('product_volumes').insert(payload).select().single()
      if (data) setVolumes(prev => [...prev, data])
    }
    setSavingVolume(false)
    setVolumeModal(false)
  }

  const handleVolumeDelete = async () => {
    setSavingVolume(true)
    await supabase.from('product_volumes').delete().eq('id', deleteVolume.id)
    setVolumes(prev => prev.filter(v => v.id !== deleteVolume.id))
    setSavingVolume(false)
    setDeleteVolume(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
    }
    if (editing) await products.update(editing.id, payload)
    else await products.create(payload)
    setSaving(false)
    setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    if (tab === 0) await products.remove(deleteTarget.id)
    else await reviews.remove(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
  }

  // Shared select style
  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer',
    appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 12px) center',
  }

  return (
    <div>
      <AdminHeader
        title="Produits & Avis"
        subtitle="Gérer les produits, volumes et avis clients"
        onMenuClick={onMenuClick}
        action={tab === 0 ? (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
            ➕ Nouveau produit
          </button>
        ) : undefined}
      />

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition"
              style={tab === i
                ? { background: '#e8c547', color: '#0f172a' }
                : { color: 'rgba(255,255,255,0.4)' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <DataTable
              data={products.data}
              loading={products.loading}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onToggle={row => products.toggleActive(row.id, !!row.is_active)}
              columns={[
                {
                  key: 'image_url', label: 'Image',
                  render: row => row.image_url
                    ? <img src={row.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    : <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600" style={{ background: 'rgba(255,255,255,0.05)' }}>📦</div>
                },
                { key: 'name_en', label: 'Nom (FR)' },
                { key: 'name_ar', label: 'Nom (AR)' },
                { key: 'price', label: 'Prix', render: row => `${row.price ?? 0} MAD` },
                { key: 'stock', label: 'Stock' },
                {
                  key: 'category_id', label: 'Catégorie',
                  render: row => {
                    const cat = categories.find(c => c.id === row.category_id)
                    return cat ? (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(232,197,71,0.1)', color: '#e8c547' }}>
                        {cat.name_en}
                      </span>
                    ) : <span className="text-gray-600 text-xs">—</span>
                  }
                },
                {
                  key: 'cooperative_id', label: 'Coopérative',
                  render: row => {
                    const coop = cooperatives.find(c => c.id === row.cooperative_id)
                    return coop ? (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        {coop.name_en}
                      </span>
                    ) : <span className="text-gray-600 text-xs">—</span>
                  }
                },
                {
                  key: 'volumes', label: 'Volumes',
                  render: row => (
                    <button onClick={() => openVolumes(row)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                      style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                      📦 Volumes
                    </button>
                  )
                },
              ]}
            />
          </div>
        )}

        {tab === 1 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <DataTable
              data={reviews.data}
              loading={reviews.loading}
              onDelete={setDeleteTarget}
              columns={[
                { key: 'author', label: 'Auteur' },
                { key: 'rating', label: 'Note', render: row => `${'⭐'.repeat(Math.round(row.rating ?? 0))} (${row.rating})` },
                { key: 'comment_en', label: 'Commentaire', render: row => (row.comment_en ?? '').slice(0, 60) + '...' },
                { key: 'created_at', label: 'Date', render: row => new Date(row.created_at).toLocaleDateString('fr-FR') },
              ]}
            />
          </div>
        )}
      </div>

      {/* ── Product Form Modal ── */}
      <FormModal
        open={modal}
        title={editing ? 'Modifier le produit' : 'Nouveau produit'}
        onClose={() => setModal(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <Grid2>
          <Field label="Nom (Français)">
            <Input value={form.name_en} onChange={e => set('name_en', e.target.value)} placeholder="Nom du produit" required />
          </Field>
          <Field label="Nom (Arabe)">
            <Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} placeholder="اسم المنتج" required />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)">
            <Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} />
          </Field>
          <Field label="Description (AR)">
            <Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Prix (MAD)">
            <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Stock">
            <Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
          </Field>
        </Grid2>

        {/* ── Catégorie Dropdown ── */}
        <Field label="Catégorie">
          <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={selectStyle}>
            <option value="" style={{ background: '#1e293b' }}>— Sélectionner une catégorie —</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} style={{ background: '#1e293b' }}>
                {cat.name_en} / {cat.name_ar}
              </option>
            ))}
          </select>
        </Field>

        {/* ── Coopérative Dropdown ── */}
        <Field label="Coopérative">
          <select value={form.cooperative_id} onChange={e => set('cooperative_id', e.target.value)} style={selectStyle}>
            <option value="" style={{ background: '#1e293b' }}>— Sélectionner une coopérative —</option>
            {cooperatives.map(coop => (
              <option key={coop.id} value={coop.id} style={{ background: '#1e293b' }}>
                {coop.name_en} / {coop.name_ar}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Image du produit">
          <ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="products" />
        </Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} />
            Actif
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <input type="checkbox" checked={!!form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            Mis en avant
          </label>
        </div>
      </FormModal>

      {/* ── Volumes Modal ── */}
      {volumesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setVolumesModal(false)} />
          <div className="relative rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h2 className="text-white font-semibold text-lg">Volumes</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{selectedProduct?.name_en}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={openCreateVolume}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
                  ➕ Ajouter
                </button>
                <button onClick={() => setVolumesModal(false)} className="text-gray-500 hover:text-white transition text-xl">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {volumesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(232,197,71,0.2)', borderTopColor: '#e8c547' }} />
                </div>
              ) : volumes.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <p className="text-3xl mb-3">📦</p>
                  <p className="text-sm">Aucun volume — cliquez sur Ajouter</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {volumes.map(v => (
                    <div key={v.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                          style={{ background: 'rgba(232,197,71,0.1)', color: '#e8c547' }}>
                          {v.value}{v.unit}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{v.label_en} / {v.label_ar}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{v.price} MAD — ordre: {v.order_index}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditVolume(v)}
                          className="text-xs px-2 py-1 rounded-lg transition hover:opacity-80"
                          style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                          Modifier
                        </button>
                        <button onClick={() => setDeleteVolume(v)}
                          className="text-xs px-2 py-1 rounded-lg transition hover:opacity-80"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Volume Form Modal ── */}
      <FormModal
        open={volumeModal}
        title={editingVolume ? 'Modifier le volume' : 'Nouveau volume'}
        onClose={() => setVolumeModal(false)}
        onSubmit={handleVolumeSubmit}
        loading={savingVolume}
      >
        <Grid2>
          <Field label="Label (FR)">
            <Input value={volumeForm.label_en} onChange={e => setVol('label_en', e.target.value)} placeholder="ex: 500ml" required />
          </Field>
          <Field label="Label (AR)">
            <Input value={volumeForm.label_ar} onChange={e => setVol('label_ar', e.target.value)} placeholder="مل 500" required />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Valeur">
            <Input type="number" value={volumeForm.value} onChange={e => setVol('value', e.target.value)} placeholder="500" required />
          </Field>
          <Field label="Unité">
            <Input value={volumeForm.unit} onChange={e => setVol('unit', e.target.value)} placeholder="ml / g / kg / L" required />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Prix (MAD)">
            <Input type="number" value={volumeForm.price} onChange={e => setVol('price', e.target.value)} placeholder="0.00" required />
          </Field>
          <Field label="Ordre">
            <Input type="number" value={volumeForm.order_index} onChange={e => setVol('order_index', e.target.value)} />
          </Field>
        </Grid2>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
      <ConfirmDialog open={!!deleteVolume} onConfirm={handleVolumeDelete} onCancel={() => setDeleteVolume(null)} loading={savingVolume} />
    </div>
  )
}