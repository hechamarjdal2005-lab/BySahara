import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import { useCrud } from '../hooks/useCrud'

const TABS = ['Paramètres du site', 'Provinces']

export default function SettingsPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const settings = useCrud<any>('site_settings', 'key')
  const provinces = useCrud<any>('provinces', 'name_en')

  const sources = [settings, provinces]
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
        <Field label="Clé (unique)"><Input value={form.key ?? ''} onChange={e => set('key', e.target.value)} required placeholder="site_name, contact_email..." disabled={!!editing} /></Field>
        <Grid2>
          <Field label="Valeur (FR)"><Textarea value={form.value_en ?? ''} onChange={e => set('value_en', e.target.value)} /></Field>
          <Field label="Valeur (AR)"><Textarea value={form.value_ar ?? ''} onChange={e => set('value_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Description (usage interne)"><Input value={form.description ?? ''} onChange={e => set('description', e.target.value)} /></Field>
      </>
    )
    return (
      <>
        <Field label="ID (slug)"><Input value={form.id ?? ''} onChange={e => set('id', e.target.value)} required disabled={!!editing} /></Field>
        <Grid2>
          <Field label="Nom (FR)"><Input value={form.name_en ?? ''} onChange={e => set('name_en', e.target.value)} required /></Field>
          <Field label="Nom (AR)"><Input value={form.name_ar ?? ''} onChange={e => set('name_ar', e.target.value)} required /></Field>
        </Grid2>
      </>
    )
  }

  return (
    <div>
      <AdminHeader title="Paramètres" subtitle="Configuration générale du site" onMenuClick={onMenuClick}
        action={<button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">➕ Ajouter</button>}
      />
      <div className="p-6 space-y-5">
        {/* Info banner */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-3 text-sm text-blue-400 flex gap-3">
          <span>ℹ️</span>
          <span>Les paramètres du site sont utilisés dans tout le frontend. Modifiez-les avec précaution.</span>
        </div>

        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === i ? 'bg-[#e8c547] text-[#0f172a]' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          {tab === 0 ? (
            <DataTable data={settings.data} loading={settings.loading} onEdit={openEdit} onDelete={setDeleteTarget}
              onToggle={row => settings.toggleActive(row.id, !!row.is_active)}
              columns={[
                { key: 'key', label: 'Clé', render: row => <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-[#e8c547]">{row.key}</code> },
                { key: 'value_en', label: 'Valeur (FR)', render: row => (row.value_en ?? '').slice(0, 60) },
                { key: 'value_ar', label: 'Valeur (AR)', render: row => (row.value_ar ?? '').slice(0, 60) },
                { key: 'description', label: 'Description', render: row => <span className="text-gray-500 text-xs">{row.description}</span> },
              ]}
            />
          ) : (
            <DataTable data={provinces.data} loading={provinces.loading} onEdit={openEdit} onDelete={setDeleteTarget}
              onToggle={row => provinces.toggleActive(row.id, !!row.is_active)}
              columns={[
                { key: 'id', label: 'ID', render: row => <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-[#e8c547]">{row.id}</code> },
                { key: 'name_en', label: 'Nom (FR)' },
                { key: 'name_ar', label: 'Nom (AR)' },
              ]}
            />
          )}
        </div>
      </div>
      <FormModal open={modal} title={`${editing ? 'Modifier' : 'Ajouter'} — ${TABS[tab]}`} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
        {renderForm()}
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}