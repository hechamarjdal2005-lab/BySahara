import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'

const TABS = ['À propos', 'Contact', 'Fonctionnalités', 'Page Coopératives']

export default function ContentPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const about = useCrud<any>('about_page_content', 'order_index')
  const contact = useCrud<any>('contact_page_content', 'order_index')
  const features = useCrud<any>('features', 'order_index')
  const coopContent = useCrud<any>('cooperatives_page_content', 'order_index')

  const sources = [about, contact, features, coopContent]
  const current = sources[tab]

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const openCreate = () => { setEditing(null); setForm({}); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    if (editing) await current.update(editing.id, form)
    else await current.create(form)
    setSaving(false); setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true); await current.remove(deleteTarget.id); setSaving(false); setDeleteTarget(null)
  }

  const renderForm = () => {
    if (tab === 0) return ( // About
      <>
        <Field label="Clé de section"><Input value={form.section_key ?? ''} onChange={e => set('section_key', e.target.value)} placeholder="hero, mission, etc." required /></Field>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Sous-titre (FR)"><Input value={form.subtitle_en ?? ''} onChange={e => set('subtitle_en', e.target.value)} /></Field>
          <Field label="Sous-titre (AR)"><Input value={form.subtitle_ar ?? ''} onChange={e => set('subtitle_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Contenu (FR)"><Textarea value={form.content_en ?? ''} onChange={e => set('content_en', e.target.value)} rows={4} /></Field>
          <Field label="Contenu (AR)"><Textarea value={form.content_ar ?? ''} onChange={e => set('content_ar', e.target.value)} rows={4} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge (FR)"><Input value={form.badge_text_en ?? ''} onChange={e => set('badge_text_en', e.target.value)} /></Field>
          <Field label="Badge (AR)"><Input value={form.badge_text_ar ?? ''} onChange={e => set('badge_text_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="about" /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )

    if (tab === 1) return ( // Contact
      <>
        <Field label="Clé de section"><Input value={form.section_key ?? ''} onChange={e => set('section_key', e.target.value)} required /></Field>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Label (FR)"><Input value={form.label_en ?? ''} onChange={e => set('label_en', e.target.value)} /></Field>
          <Field label="Label (AR)"><Input value={form.label_ar ?? ''} onChange={e => set('label_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Placeholder (FR)"><Input value={form.placeholder_en ?? ''} onChange={e => set('placeholder_en', e.target.value)} /></Field>
          <Field label="Placeholder (AR)"><Input value={form.placeholder_ar ?? ''} onChange={e => set('placeholder_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )

    if (tab === 2) return ( // Features
      <>
        <Field label="Clé icône"><Input value={form.icon_key ?? ''} onChange={e => set('icon_key', e.target.value)} placeholder="shield, leaf, etc." required /></Field>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} required /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description_en ?? ''} onChange={e => set('description_en', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar ?? ''} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )

    return ( // Cooperatives Page Content
      <>
        <Field label="Clé de section"><Input value={form.section_key ?? ''} onChange={e => set('section_key', e.target.value)} required /></Field>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Description (FR)"><Textarea value={form.description_en ?? ''} onChange={e => set('description_en', e.target.value)} /></Field>
          <Field label="Description (AR)"><Textarea value={form.description_ar ?? ''} onChange={e => set('description_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )
  }

  return (
    <div>
      <AdminHeader title="Contenu des pages" subtitle="Gérer le contenu éditorial du site" onMenuClick={onMenuClick}
        action={<button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">➕ Ajouter</button>}
      />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === i ? 'bg-[#e8c547] text-[#0f172a]' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable data={current.data} loading={current.loading} onEdit={openEdit} onDelete={setDeleteTarget}
            onToggle={row => current.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'section_key', label: 'Clé', render: row => <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-[#e8c547]">{row.section_key ?? row.icon_key ?? '—'}</code> },
              { key: 'title_en', label: 'Titre (FR)', render: row => (row.title_en ?? '').slice(0, 50) },
              { key: 'title_ar', label: 'Titre (AR)', render: row => (row.title_ar ?? '').slice(0, 50) },
              { key: 'order_index', label: 'Ordre' },
            ]}
          />
        </div>
      </div>

      <FormModal open={modal} title={`${editing ? 'Modifier' : 'Ajouter'} — ${TABS[tab]}`} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
        {renderForm()}
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}