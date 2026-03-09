import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import { useCrud } from '../hooks/useCrud'

const empty = { id: '', name_en: '', name_ar: '', icon: '', description_en: '', description_ar: '', order_index: 0, is_active: true }

export default function CategoriesPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const cats = useCrud<any>('categories', 'order_index')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(empty)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
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
      <AdminHeader
        title="Catégories"
        subtitle="Gérer les catégories de produits"
        onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">
            ➕ Nouvelle catégorie
          </button>
        }
      />

      <div className="p-6">
        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable
            data={cats.data}
            loading={cats.loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggle={row => cats.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'icon', label: 'Icône', render: row => <span className="text-2xl">{row.icon}</span> },
              { key: 'id', label: 'ID' },
              { key: 'name_en', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'order_index', label: 'Ordre' },
            ]}
          />
        </div>
      </div>

      <FormModal open={modal} title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
        <Field label="ID (slug unique)"><Input value={form.id} onChange={e => set('id', e.target.value)} placeholder="ex: huile-argan" required disabled={!!editing} /></Field>
        <Grid2>
          <Field label="Nom (Français)"><Input value={form.name_en} onChange={e => set('name_en', e.target.value)} required /></Field>
          <Field label="Nom (Arabe)"><Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required /></Field>
        </Grid2>
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