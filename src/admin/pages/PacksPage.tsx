import React, { useState } from 'react'
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

const emptyItem = {
  product_id: '', product_name: '', quantity: 1,
  unit: '', is_free: false, original_price: '', pack_price: ''
}

export default function PacksPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const packs = useCrud<any>('packs', 'order_index')

  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyPack)
  const [items, setItems] = useState<any[]>([])
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Items modal
  const [itemsModal, setItemsModal] = useState(false)
  const [selectedPack, setSelectedPack] = useState<any>(null)
  const [packItems, setPackItems] = useState<any[]>([])
  const [itemForm, setItemForm] = useState<any>(emptyItem)
  const [editingItem, setEditingItem] = useState<number | null>(null)

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const setIt = (k: string, v: any) => setItemForm((p: any) => ({ ...p, [k]: v }))

  const openCreate = () => {
    setEditing(null)
    setForm(emptyPack)
    setItems([])
    setModal(true)
  }

  const openEdit = (row: any) => {
    setEditing(row)
    setForm(row)
    setItems(row.items ?? [])
    setModal(true)
  }

  const openItems = (pack: any) => {
    setSelectedPack(pack)
    setPackItems(pack.items ?? [])
    setItemForm(emptyItem)
    setEditingItem(null)
    setItemsModal(true)
  }

  const addItem = () => {
    const item = {
      ...itemForm,
      quantity: parseInt(itemForm.quantity) || 1,
      original_price: parseFloat(itemForm.original_price) || 0,
      pack_price: parseFloat(itemForm.pack_price) || 0,
    }
    if (editingItem !== null) {
      const updated = [...packItems]
      updated[editingItem] = item
      setPackItems(updated)
      setEditingItem(null)
    } else {
      setPackItems(prev => [...prev, item])
    }
    setItemForm(emptyItem)
  }

  const removeItem = (i: number) => setPackItems(prev => prev.filter((_, idx) => idx !== i))

  const saveItems = async () => {
    setSaving(true)
    await supabase.from('packs').update({ items: packItems }).eq('id', selectedPack.id)
    packs.refetch()
    setSaving(false)
    setItemsModal(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      items,
      pack_price: parseFloat(form.pack_price) || 0,
      total_original_price: parseFloat(form.total_original_price) || 0,
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

  return (
    <div>
      <AdminHeader
        title="Packs & Offres"
        subtitle="Gérer les packs et offres groupées"
        onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">
            ➕ Nouveau pack
          </button>
        }
      />

      <div className="p-6">
        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable
            data={packs.data}
            loading={packs.loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggle={row => packs.toggleActive(row.id, !!row.is_active)}
            columns={[
              {
                key: 'image_url', label: 'Image',
                render: row => row.image_url
                  ? <img src={row.image_url} alt="" className="w-12 h-10 rounded-lg object-cover" />
                  : <div className="w-12 h-10 rounded-lg bg-white/5 flex items-center justify-center">🎁</div>
              },
              { key: 'name', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'pack_price', label: 'Prix pack', render: row => `${row.pack_price} MAD` },
              { key: 'savings', label: 'Économie', render: row => <span className="text-green-400">-{row.savings} MAD</span> },
              { key: 'stock', label: 'Stock' },
              { key: 'badge', label: 'Badge' },
              {
                key: 'items', label: 'Articles',
                render: row => (
                  <button
                    onClick={() => openItems(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs font-medium"
                  >
                    🛍️ {(row.items ?? []).length} article(s)
                  </button>
                )
              },
            ]}
          />
        </div>
      </div>

      {/* ── Pack Form Modal ── */}
      <FormModal
        open={modal}
        title={editing ? 'Modifier le pack' : 'Nouveau pack'}
        onClose={() => setModal(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <Field label="ID (unique)">
          <Input value={form.id} onChange={e => set('id', e.target.value)} placeholder="pack-001" required disabled={!!editing} />
        </Field>
        <Grid2>
          <Field label="Nom (FR)"><Input value={form.name} onChange={e => set('name', e.target.value)} required /></Field>
          <Field label="Nom (AR)"><Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description} onChange={e => set('description', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Prix pack (MAD)"><Input type="number" value={form.pack_price} onChange={e => set('pack_price', e.target.value)} required /></Field>
          <Field label="Prix original (MAD)"><Input type="number" value={form.total_original_price} onChange={e => set('total_original_price', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Économie (MAD)"><Input type="number" value={form.savings} onChange={e => set('savings', e.target.value)} /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge (FR)"><Input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="Best Value, New..." /></Field>
          <Field label="Badge (AR)"><Input value={form.badge_ar} onChange={e => set('badge_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="ID Coopérative"><Input value={form.cooperative_id} onChange={e => set('cooperative_id', e.target.value)} /></Field>
          <Field label="Nom Coopérative"><Input value={form.cooperative_name} onChange={e => set('cooperative_name', e.target.value)} /></Field>
        </Grid2>
        <Field label="Ordre"><Input type="number" value={form.order_index} onChange={e => set('order_index', e.target.value)} /></Field>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="packs" /></Field>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} />
          Actif
        </label>
      </FormModal>

      {/* ── Items Modal ── */}
      {itemsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setItemsModal(false)} />
          <div className="relative bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-white font-semibold text-lg">Articles du pack</h2>
                <p className="text-gray-500 text-xs mt-0.5">{selectedPack?.name}</p>
              </div>
              <button onClick={() => setItemsModal(false)} className="text-gray-500 hover:text-white text-xl transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Add item form */}
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <p className="text-[#e8c547] text-xs font-semibold uppercase tracking-wider">
                  {editingItem !== null ? 'Modifier article' : 'Ajouter article'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nom produit (FR)"><Input value={itemForm.product_name} onChange={e => setIt('product_name', e.target.value)} placeholder="Argan Oil" /></Field>
                  <Field label="ID produit"><Input value={itemForm.product_id} onChange={e => setIt('product_id', e.target.value)} placeholder="prod-argan-oil" /></Field>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Quantité"><Input type="number" value={itemForm.quantity} onChange={e => setIt('quantity', e.target.value)} /></Field>
                  <Field label="Unité"><Input value={itemForm.unit} onChange={e => setIt('unit', e.target.value)} placeholder="50ml" /></Field>
                  <Field label="Prix original"><Input type="number" value={itemForm.original_price} onChange={e => setIt('original_price', e.target.value)} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <Field label="Prix dans le pack"><Input type="number" value={itemForm.pack_price} onChange={e => setIt('pack_price', e.target.value)} /></Field>
                  <label className="flex items-center gap-2 text-sm text-gray-400 pb-2.5 cursor-pointer">
                    <input type="checkbox" checked={!!itemForm.is_free} onChange={e => setIt('is_free', e.target.checked)} />
                    Gratuit 🎁
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-2 rounded-xl bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/20 hover:bg-[#e8c547]/20 transition text-sm font-medium"
                >
                  {editingItem !== null ? '✓ Mettre à jour' : '➕ Ajouter'}
                </button>
              </div>

              {/* Items list */}
              {packItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">Aucun article — ajoutez-en ci-dessus</div>
              ) : (
                <div className="space-y-2">
                  {packItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e8c547]/10 flex items-center justify-center text-sm">
                          {item.is_free ? '🎁' : '📦'}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {item.product_name} {item.unit && `— ${item.unit}`} x{item.quantity}
                            {item.is_free && <span className="ml-2 text-xs text-green-400 font-bold">GRATUIT</span>}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Original: {item.original_price} MAD → Pack: {item.is_free ? '0' : item.pack_price} MAD
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setItemForm(item); setEditingItem(i) }} className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition">Modifier</button>
                        <button onClick={() => removeItem(i)} className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
              <button onClick={() => setItemsModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition text-sm">Annuler</button>
              <button onClick={saveItems} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}