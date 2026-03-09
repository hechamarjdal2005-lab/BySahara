import React from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import FormModal, { Field, Input, Textarea, Grid2 } from '../components/FormModal'
import ImageUploader from '../components/ImageUploader'
import { useCrud } from '../hooks/useCrud'

const TABS = ['Hero Slides', 'Bannières', 'Promotions', 'Pubs Marques', 'Pubs Coopératives']

export default function MediaPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [tab, setTab] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const heroSlides = useCrud<any>('hero_slides', 'order_index')
  const banners = useCrud<any>('banners', 'created_at')
  const promotions = useCrud<any>('promotions', 'order_index')
  const brandAds = useCrud<any>('brand_ads', 'order_index')
  const coopAds = useCrud<any>('cooperative_ads', 'order_index')

  const sources = [heroSlides, banners, promotions, brandAds, coopAds]
  const current = sources[tab]

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const openCreate = () => { setEditing(null); setForm({}); setModal(true) }
  const openEdit = (row: any) => { setEditing(row); setForm(row); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) await current.update(editing.id, form)
    else await current.create(form)
    setSaving(false)
    setModal(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    await current.remove(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
  }

  const renderForm = () => {
    if (tab === 0) return ( // Hero Slides
      <>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} required /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Sous-titre (FR)"><Textarea value={form.subtitle_en ?? ''} onChange={e => set('subtitle_en', e.target.value)} /></Field>
          <Field label="Sous-titre (AR)"><Textarea value={form.subtitle_ar ?? ''} onChange={e => set('subtitle_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="hero" /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )

    if (tab === 1) return ( // Banners
      <>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="banners" /></Field>
        <Field label="Lien URL"><Input value={form.link_url ?? ''} onChange={e => set('link_url', e.target.value)} placeholder="https://..." /></Field>
      </>
    )

    if (tab === 2) return ( // Promotions
      <>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} required /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Sous-titre (FR)"><Input value={form.subtitle_en ?? ''} onChange={e => set('subtitle_en', e.target.value)} /></Field>
          <Field label="Sous-titre (AR)"><Input value={form.subtitle_ar ?? ''} onChange={e => set('subtitle_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge (FR)"><Input value={form.badge_en ?? ''} onChange={e => set('badge_en', e.target.value)} /></Field>
          <Field label="Badge (AR)"><Input value={form.badge_ar ?? ''} onChange={e => set('badge_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="CTA (FR)"><Input value={form.cta_en ?? ''} onChange={e => set('cta_en', e.target.value)} /></Field>
          <Field label="CTA (AR)"><Input value={form.cta_ar ?? ''} onChange={e => set('cta_ar', e.target.value)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Réduction (ex: -20%)"><Input value={form.discount ?? ''} onChange={e => set('discount', e.target.value)} /></Field>
          <Field label="Lien CTA"><Input value={form.cta_link ?? ''} onChange={e => set('cta_link', e.target.value)} /></Field>
        </Grid2>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="promotions" /></Field>
        <Grid2>
          <Field label="Couleur dégradé début"><Input value={form.gradient_from ?? '#455324'} onChange={e => set('gradient_from', e.target.value)} /></Field>
          <Field label="Couleur dégradé fin"><Input value={form.gradient_to ?? '#2d3816'} onChange={e => set('gradient_to', e.target.value)} /></Field>
        </Grid2>
      </>
    )

    // Brand ads & Coop ads (tabs 3 & 4)
    return (
      <>
        <Grid2>
          <Field label="Titre (FR)"><Input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} required /></Field>
          <Field label="Titre (AR)"><Input value={form.title_ar ?? ''} onChange={e => set('title_ar', e.target.value)} required /></Field>
        </Grid2>
        <Grid2>
          <Field label="Sous-titre (FR)"><Input value={form.subtitle_en ?? ''} onChange={e => set('subtitle_en', e.target.value)} /></Field>
          <Field label="Sous-titre (AR)"><Input value={form.subtitle_ar ?? ''} onChange={e => set('subtitle_ar', e.target.value)} /></Field>
        </Grid2>
        {tab === 3 && (
          <Grid2>
            <Field label="Texte badge"><Input value={form.badge_text ?? ''} onChange={e => set('badge_text', e.target.value)} /></Field>
            <Field label="Couleur badge"><Input value={form.badge_color ?? ''} onChange={e => set('badge_color', e.target.value)} placeholder="#455324" /></Field>
          </Grid2>
        )}
        <Field label="Lien"><Input value={form.link_url ?? ''} onChange={e => set('link_url', e.target.value)} /></Field>
        <Field label="Image"><ImageUploader value={form.image_url} onChange={url => set('image_url', url)} folder="ads" /></Field>
        <Field label="Ordre"><Input type="number" value={form.order_index ?? 0} onChange={e => set('order_index', parseInt(e.target.value))} /></Field>
      </>
    )
  }

  const tabLabels = ['Slide hero', 'Bannière', 'Promotion', 'Pub marque', 'Pub coopérative']

  return (
    <div>
      <AdminHeader
        title="Médias & Publicités"
        subtitle="Gérer les slides, bannières, promotions et publicités"
        onMenuClick={onMenuClick}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition">
            ➕ Ajouter
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${tab === i ? 'bg-[#e8c547] text-[#0f172a]' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden">
          <DataTable
            data={current.data}
            loading={current.loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggle={row => current.toggleActive(row.id, !!row.is_active)}
            columns={[
              { key: 'image_url', label: 'Image', render: row => row.image_url ? <img src={row.image_url} alt="" className="w-12 h-8 rounded object-cover" /> : <div className="w-12 h-8 rounded bg-white/5" /> },
              { key: 'title_en', label: 'Titre (FR)' },
              { key: 'title_ar', label: 'Titre (AR)' },
              { key: 'order_index', label: 'Ordre' },
            ]}
          />
        </div>
      </div>

      <FormModal
        open={modal}
        title={`${editing ? 'Modifier' : 'Ajouter'} — ${tabLabels[tab]}`}
        onClose={() => setModal(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        {renderForm()}
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={saving} />
    </div>
  )
}