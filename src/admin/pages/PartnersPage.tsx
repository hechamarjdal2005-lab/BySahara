import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'

const empty = { name_en: '', name_ar: '', logo_url: '', order_index: 0, is_active: true }

export default function PartnersPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const partners = useCrud<any>('partners', 'order_index')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(empty)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    if (editing) await partners.update(editing.id, form)
    else await partners.create(form)
    setSaving(false); setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true); await partners.remove(deleteTarget.id); setSaving(false); setDeleteTarget(null)
  }

  return (
    <div>
      <AdminHeader title="Partenaires" subtitle="Gérer les partenaires du site" onMenuClick={onMenuClick}
        action={<button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">➕ Nouveau partenaire</button>}
      />
      <div className="p-6">
        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable data={partners.data} loading={partners.loading} onEdit={openEdit} onDelete={setDeleteTarget}
            onToggle={row => partners.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'logo_url', label: 'Logo', render: row => row.logo_url ? <img src={row.logo_url} alt="" className="h-8 w-20 object-contain" /> : '—' },
              { key: 'name_en', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'order_index', label: 'Ordre' },
            ]}
          />
        </div>
      </div>
      <FormModal open={modal} title={editing ? 'Modifier partenaire' : 'Nouveau partenaire'} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
        <Grid2>
          <Field label="Nom (FR)"><Input value={form.name_en} onChange={e => set('name_en', e.target.value)} required /></Field>
          <Field label="Nom (AR)"><Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required /></Field>
        </Grid2>
        <Field label="Ordre"><Input type="number" value={form.order_index} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
        <Field label="Logo"><ImageUploader value={form.logo_url} onChange={url => set('logo_url', url)} folder="partners" /></Field>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}