import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'

const empty = {
  name_en: '', name_ar: '', description_en: '', description_ar: '',
  short_description_en: '', short_description_ar: '',
  image: '', logo: '', city_en: '', city_ar: '',
  province_en: '', province_ar: '', region_en: '', region_ar: '',
  address_en: '', address_ar: '', phone: '', email: '', website: '',
  founded_year: '', member_count: '', latitude: '', longitude: '',
}

export default function CooperativesPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const coops = useCrud<any>('cooperatives', 'created_at')
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
    const payload = {
      ...form,
      founded_year: parseInt(form.founded_year) || null,
      member_count: parseInt(form.member_count) || null,
      latitude: parseFloat(form.latitude) || null,
      longitude: parseFloat(form.longitude) || null,
    }
    if (editing) await coops.update(editing.id, payload)
    else await coops.create(payload)
    setSaving(false)
    setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    await coops.remove(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
  }

  return (
    <div>
      <AdminHeader
        title="Coopératives"
        subtitle="Gérer les coopératives du réseau"
        onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">
            ➕ Nouvelle coopérative
          </button>
        }
      />

      <div className="p-6">
        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable
            data={coops.data}
            loading={coops.loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            columns={[
              { key: 'image', label: 'Photo', render: row => row.image ? <img src={row.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">🤝</div> },
              { key: 'name_en', label: 'Nom (FR)' },
              { key: 'name_ar', label: 'Nom (AR)' },
              { key: 'city_en', label: 'Ville' },
              { key: 'province_en', label: 'Province' },
              { key: 'member_count', label: 'Membres' },
              { key: 'phone', label: 'Téléphone' },
            ]}
          />
        </div>
      </div>

      <FormModal open={modal} title={editing ? 'Modifier la coopérative' : 'Nouvelle coopérative'} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
        <Grid2>
          <Field label="Nom (Français)"><Input value={form.name_en} onChange={e => set('name_en', e.target.value)} required /></Field>
          <Field label="Nom (Arabe)"><Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description courte (FR)"><Textarea value={form.short_description_en} onChange={e => set('short_description_en', e.target.value)} /></Field>
          <Field label="Description courte (AR)"><Textarea value={form.short_description_ar} onChange={e => set('short_description_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} rows={4} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} rows={4} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Ville (FR)"><Input value={form.city_en} onChange={e => set('city_en', e.target.value)} /></Field>
          <Field label="Ville (AR)"><Input value={form.city_ar} onChange={e => set('city_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Province (FR)"><Input value={form.province_en} onChange={e => set('province_en', e.target.value)} /></Field>
          <Field label="Province (AR)"><Input value={form.province_ar} onChange={e => set('province_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Région (FR)"><Input value={form.region_en} onChange={e => set('region_en', e.target.value)} /></Field>
          <Field label="Région (AR)"><Input value={form.region_ar} onChange={e => set('region_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Téléphone"><Input value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Année fondation"><Input type="number" value={form.founded_year} onChange={e => set('founded_year', e.target.value)} /></Field>
          <Field label="Nombre de membres"><Input type="number" value={form.member_count} onChange={e => set('member_count', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Latitude"><Input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)} /></Field>
          <Field label="Longitude"><Input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image principale"><ImageUploader value={form.image} onChange={url => set('image', url)} folder="cooperatives" /></Field>
        <Field label="Logo"><ImageUploader value={form.logo} onChange={url => set('logo', url)} folder="cooperatives/logos" /></Field>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}