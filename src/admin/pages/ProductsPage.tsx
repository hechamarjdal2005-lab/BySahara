import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'

const TABS = ['Produits', 'Avis clients']

const emptyProduct = {
  name_en: '', name_ar: '', description_en: '', description_ar: '',
  price: '', image_url: '', category_id: '', cooperative_id: '',
  stock: '', is_active: true, is_featured: false,
}

export default function ProductsPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyProduct)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const products = useCrud<any>('products', 'created_at')
  const reviews = useCrud<any>('reviews', 'created_at')

  const set = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }))

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

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
        subtitle="Gérer les produits et les avis clients"
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
                { key: 'name_en', label: 'Nom (EN)' },
                { key: 'name_ar', label: 'Nom (AR)' },
                { key: 'price', label: 'Prix', render: row => `${row.price ?? 0} MAD` },
                { key: 'stock', label: 'Stock' },
                { key: 'category_id', label: 'Catégorie' },
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
                { key: 'comment_en', label: 'Commentaire (EN)', render: row => (row.comment_en ?? '').slice(0, 60) + '...' },
                { key: 'created_at', label: 'Date', render: row => new Date(row.created_at).toLocaleDateString('fr-FR') },
              ]}
            />
          </div>
        )}
      </div>

      {/* Product Form Modal */}
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
          <Field label="Description (FR)"><Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} placeholder="Description..." /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} placeholder="وصف..." /></Field>
        </Grid2>
        <Grid2>
          <Field label="Prix (MAD)"><Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" /></Field>
        </Grid2>
        <Grid2>
          <Field label="ID Catégorie"><Input value={form.category_id} onChange={e => set('category_id', e.target.value)} placeholder="ex: huile-dargan" /></Field>
          <Field label="ID Coopérative"><Input value={form.cooperative_id} onChange={e => set('cooperative_id', e.target.value)} placeholder="UUID coopérative" /></Field>
        </Grid2>
        <Field label="Image du produit">
          <ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="products" />
        </Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} className="rounded" />
            Actif
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={!!form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="rounded" />
            Mis en avant
          </label>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  )
}