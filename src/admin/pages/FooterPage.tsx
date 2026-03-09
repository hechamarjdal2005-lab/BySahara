import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Grid2 } from '../components/FormModal'
import { useCrud } from '../hooks/useCrud'

const TABS = ['Liens', 'Réseaux sociaux', 'Contact', 'Newsletter']

export default function FooterPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const links = useCrud<any>('footer_links', 'order_index')
  const social = useCrud<any>('footer_social', 'order_index')
  const contact = useCrud<any>('footer_contact', 'order_index')
  const newsletter = useCrud<any>('footer_newsletter', 'created_at')

  const sources = [links, social, contact, newsletter]
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
    if (tab === 0) return (
      <>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} required /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} required /></Field>
        </Grid2>
        <Field label="URL"><Input value={form.url ?? ''} onChange={e => set('url', e.target.value)} placeholder="/shop" required /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )
    if (tab === 1) return (
      <>
        <Field label="Plateforme"><Input value={form.platform ?? ''} onChange={e => set('platform', e.target.value)} placeholder="instagram, facebook..." required /></Field>
        <Field label="URL"><Input value={form.url ?? ''} onChange={e => set('url', e.target.value)} placeholder="https://..." required /></Field>
        <Field label="Clé icône"><Input value={form.icon_key ?? ''} onChange={e => set('icon_key', e.target.value)} placeholder="instagram" /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )
    if (tab === 2) return (
      <>
        <Field label="Clé"><Input value={form.key ?? ''} onChange={e => set('key', e.target.value)} required placeholder="phone, email, address..." /></Field>
        <Grid2>
          <Field label="Valeur (FR)"><Input value={form.value_en ?? ''} onChange={e => set('value_en', e.target.value)} required /></Field>
          <Field label="Valeur (AR)"><Input value={form.value_ar ?? ''} onChange={e => set('value_ar', e.target.value)} required /></Field>
        </Grid2>
        <Field label="Clé icône"><Input value={form.icon_key ?? ''} onChange={e => set('icon_key', e.target.value)} /></Field>
      </>
    )
    return ( // Newsletter
      <>
        <Field label="Clé de section"><Input value={form.section_key ?? ''} onChange={e => set('section_key', e.target.value)} required /></Field>
        <Grid2>
          <Field label="Texte (FR)"><Input value={form.text_en ?? ''} onChange={e => set('text_en', e.target.value)} /></Field>
          <Field label="Texte (AR)"><Input value={form.text_ar ?? ''} onChange={e => set('text_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Placeholder (FR)"><Input value={form.placeholder_en ?? ''} onChange={e => set('placeholder_en', e.target.value)} /></Field>
          <Field label="Placeholder (AR)"><Input value={form.placeholder_ar ?? ''} onChange={e => set('placeholder_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Bouton (FR)"><Input value={form.button_text_en ?? ''} onChange={e => set('button_text_en', e.target.value)} /></Field>
          <Field label="Bouton (AR)"><Input value={form.button_text_ar ?? ''} onChange={e => set('button_text_ar', e.target.value)} /></Field>
        </Grid2>
      </>
    )
  }

  const colsByTab = [
    [{ key: 'title_en', label: 'Titre (FR)' }, { key: 'title_ar', label: 'Titre (AR)' }, { key: 'url', label: 'URL' }, { key: 'order_index', label: 'Ordre' }],
    [{ key: 'platform', label: 'Plateforme' }, { key: 'url', label: 'URL' }, { key: 'icon_key', label: 'Icône' }],
    [{ key: 'key', label: 'Clé' }, { key: 'value_en', label: 'Valeur (FR)' }, { key: 'value_ar', label: 'Valeur (AR)' }],
    [{ key: 'section_key', label: 'Clé' }, { key: 'text_en', label: 'Texte (FR)' }, { key: 'button_text_en', label: 'Bouton (FR)' }],
  ]

  return (
    <div>
      <AdminHeader title="Pied de page" subtitle="Gérer les liens, réseaux et informations du footer" onMenuClick={onMenuClick}
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
            columns={colsByTab[tab] as any}
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