// @ts-nocheck
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import { useCrud } from '../hooks/useCrud'

const empty = { id: '', name_en: '', name_ar: '', icon: '', description_en: '', description_ar: '', order_index: 0, is_active: true }

// Auto-generate slug from name
const toSlug = (str) => str.toLowerCase().trim()
  .replace(/\s+/g, '-')
  .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e')
  .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
  .replace(/[ùûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9-]/g, '')

export default function CategoriesPage() {
  const { onMenuClick } = useOutletContext()
  const cats = useCrud('categories', 'order_index')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm(row); setModal(true) }

  const handleNameChange = (e) => {
    const val = e.target.value
    set('name_en', val)
    // Auto-generate ID only when creating (not editing)
    if (!editing) set('id', toSlug(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, order_index: parseInt(form.order_index) || 0 }
    if (editing) await cats.update(editing.id, payload)
    else await cats.create(payload)
    setSaving(false)
    setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    await cats.remove(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
  }

  return (
    <div>
      <AdminHeader title="Catégories" subtitle="Gérer les catégories de produits" onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
            ➕ Nouvelle catégorie
          </button>
        }
      />

      <div className="p-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <DataTable
            data={cats.data} loading={cats.loading}
            onEdit={openEdit} onDelete={setDeleteTarget}
            onToggle={row => cats.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'icon', label: 'Icône', render: row => <span className="text-2xl">{row.icon}</span> },
              { key: 'id', label: 'ID', render: row => <code className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(232,197,71,0.1)', color: '#e8c547' }}>{row.id}</code> },
              { key: 'name_en', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'order_index', label: 'Ordre' },
            ]}
          />
        </div>
      </div>

      <FormModal open={modal} title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>

        <Grid2>
          <Field label="Nom (Français)">
            <Input value={form.name_en} onChange={handleNameChange} placeholder="ex: Huile d'Argan" required />
          </Field>
          <Field label="Nom (Arabe)">
            <Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} placeholder="زيت الأرغان" required />
          </Field>
        </Grid2>

        <Field label="ID (généré automatiquement)">
          <div className="relative">
            <Input
              value={form.id}
              onChange={e => set('id', toSlug(e.target.value))}
              placeholder="huile-argan"
              required
              disabled={!!editing}
              style={{ paddingRight: '120px' }}
            />
            {!editing && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                auto ✓
              </span>
            )}
          </div>
        </Field>

        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>

        <Grid2>
          <Field label="Icône (emoji)"><Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🌿" /></Field>
          <Field label="Ordre d'affichage"><Input type="number" value={form.order_index} onChange={e => set('order_index', e.target.value)} /></Field>
        </Grid2>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}