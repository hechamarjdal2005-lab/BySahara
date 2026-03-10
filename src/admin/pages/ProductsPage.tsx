import React, { useState } from 'react'
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

  // Product modal
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyProduct)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Volumes modal
  const [volumesModal, setVolumesModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [volumes, setVolumes] = useState<any[]>([])
  const [volumesLoading, setVolumesLoading] = useState(false)
  const [volumeModal, setVolumeModal] = useState(false)
  const [editingVolume, setEditingVolume] = useState<any>(null)
  const [volumeForm, setVolumeForm] = useState<any>(emptyVolume)
  const [deleteVolume, setDeleteVolume] = useState<any>(null)
  const [savingVolume, setSavingVolume] = useState(false)

  const products = useCrud<any>('products', 'created_at')
  const reviews = useCrud<any>('reviews', 'created_at')

  const set = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }))
  const setVol = (key: string, val: any) => setVolumeForm((p: any) => ({ ...p, [key]: val }))

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  // ── Volumes ──
  const openVolumes = async (product: any) => {
    setSelectedProduct(product)
    setVolumesModal(true)
    setVolumesLoading(true)
    const { data } = await supabase
      .from('product_volumes')
      .select('*')
      .eq('product_id', product.id)
      .order('order_index', { ascending: true })
    setVolumes(data ?? [])
    setVolumesLoading(false)
  }

  const openCreateVolume = () => {
    setEditingVolume(null)
    setVolumeForm(emptyVolume)
    setVolumeModal(true)
  }

  const openEditVolume = (v: any) => {
    setEditingVolume(v)
    setVolumeForm(v)
    setVolumeModal(true)
  }

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

  // ── Product submit ──
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

  return (
    <div>
      <AdminHeader
        title="Produits & Avis"
        subtitle="Gérer les produits, volumes et avis clients"
        onMenuClick={onMenuClick}
        action={tab === 0 ? (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">
            ➕ Nouveau produit
          </button>
        ) : undefined}
      />

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === i ? 'bg-[#e8c547] text-[#0f172a]' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {tab === 0 && (
          <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
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
                    : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-600">📦</div>
                },
                { key: 'name_en', label: 'Nom (FR)' },
                { key: 'name_ar', label: 'Nom (AR)' },
                { key: 'price', label: 'Prix', render: row => `${row.price ?? 0} MAD` },
                { key: 'stock', label: 'Stock' },
                {
                  key: 'volumes', label: 'Volumes',
                  render: row => (
                    <button
                      onClick={() => openVolumes(row)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs font-medium"
                    >
                      📦 Volumes
                    </button>
                  )
                },
              ]}
            />
          </div>
        )}

        {/* Reviews Table */}
        {tab === 1 && (
          <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
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
          <Field label="Nom (Français)"><Input value={form.name_en} onChange={e => set('name_en', e.target.value)} placeholder="Nom du produit" required /></Field>
          <Field label="Nom (Arabe)"><Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} placeholder="اسم المنتج" required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Prix (MAD)"><Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" /></Field>
        </Grid2>
        <Grid2>
          <Field label="ID Catégorie"><Input value={form.category_id} onChange={e => set('category_id', e.target.value)} /></Field>
          <Field label="ID Coopérative"><Input value={form.cooperative_id} onChange={e => set('cooperative_id', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image">
          <ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="products" />
        </Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} />
            Actif
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={!!form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            Mis en avant
          </label>
        </div>
      </FormModal>

      {/* ── Volumes Modal ── */}
      {volumesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setVolumesModal(false)} />
          <div className="relative bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-white font-semibold text-lg">Volumes</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {selectedProduct?.name_en}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openCreateVolume}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-xs hover:opacity-90 transition"
                >
                  ➕ Ajouter
                </button>
                <button onClick={() => setVolumesModal(false)} className="text-gray-500 hover:text-white transition text-xl">✕</button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {volumesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-[#e8c547]/20 border-t-[#e8c547] animate-spin" />
                </div>
              ) : volumes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-3xl mb-3">📦</p>
                  <p className="text-sm">Aucun volume — cliquez sur Ajouter</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {volumes.map(v => (
                    <div key={v.id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#e8c547]/10 flex items-center justify-center text-[#e8c547] font-bold text-sm">
                          {v.value}{v.unit}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{v.label_en} / {v.label_ar}</p>
                          <p className="text-gray-500 text-xs">{v.price} MAD — ordre: {v.order_index}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditVolume(v)}
                          className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteVolume(v)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
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
          <Field label="Label (FR)"><Input value={volumeForm.label_en} onChange={e => setVol('label_en', e.target.value)} placeholder="ex: 500ml" required /></Field>
          <Field label="Label (AR)"><Input value={volumeForm.label_ar} onChange={e => setVol('label_ar', e.target.value)} placeholder="مل 500" required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Valeur"><Input type="number" value={volumeForm.value} onChange={e => setVol('value', e.target.value)} placeholder="500" required /></Field>
          <Field label="Unité"><Input value={volumeForm.unit} onChange={e => setVol('unit', e.target.value)} placeholder="ml / g / kg / L" required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Prix (MAD)"><Input type="number" value={volumeForm.price} onChange={e => setVol('price', e.target.value)} placeholder="0.00" required /></Field>
          <Field label="Ordre"><Input type="number" value={volumeForm.order_index} onChange={e => setVol('order_index', e.target.value)} /></Field>
        </Grid2>
      </FormModal>

      {/* ── Confirm Delete Product/Review ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />

      {/* ── Confirm Delete Volume ── */}
      <ConfirmDialog
        open={!!deleteVolume}
        onConfirm={handleVolumeDelete}
        onCancel={() => setDeleteVolume(null)}
        loading={savingVolume}
      />
    </div>
  )
}