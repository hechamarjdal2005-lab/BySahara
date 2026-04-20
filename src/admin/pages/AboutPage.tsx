// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Loader2, Save, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import AdminHeader from '../components/AdminHeader'
import ImageUploader from '../components/ImageUploader'
import { supabase } from '../../lib/supabase'

const SECTIONS = [
  'hero_badge', 'hero_title', 'hero_description', 'hero_badge_main', 'hero_image',
  'mission_title', 'mission_content', 'mission_image', 'mission_image_small',
  'roots_badge', 'roots_title', 'roots_description',
]

const upsert = async (key: string, fields: any) => {
  const { data: existing } = await supabase
    .from('about_page_content')
    .select('id')
    .eq('section_key', key)
    .single()
  if (existing?.id) {
    return supabase.from('about_page_content').update({ ...fields, section_key: key }).eq('id', existing.id)
  } else {
    return supabase.from('about_page_content').insert({ ...fields, section_key: key, is_active: true, order_index: 0 })
  }
}

const Label = ({ children }: any) => (
  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{children}</p>
)

const Inp = (props: any) => (
  <input {...props}
    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    onFocus={e => e.target.style.borderColor = 'rgba(232,197,71,0.4)'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
  />
)

const Txtarea = (props: any) => (
  <textarea {...props}
    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition resize-none"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    onFocus={e => e.target.style.borderColor = 'rgba(232,197,71,0.4)'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
  />
)

const Section = ({ title, icon, children, defaultOpen = false }: any) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 transition hover:bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.15)' }}>
            {icon}
          </div>
          <span className="font-semibold text-white text-sm tracking-wide">{title}</span>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          {open
            ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="pt-5 space-y-4">{children}</div>
        </div>
      )}
    </div>
  )
}

export default function AboutPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [f, setF] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('about_page_content')
        .select('*')
        .in('section_key', SECTIONS)
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((row: any) => {
          const k = row.section_key
          if (row.title_en)         map[`${k}_title_en`]         = row.title_en
          if (row.content_en)       map[`${k}_content_en`]       = row.content_en
          if (row.badge_text_en)    map[`${k}_badge_text_en`]    = row.badge_text_en
          if (row.badge_subtext_en) map[`${k}_badge_subtext_en`] = row.badge_subtext_en
          if (row.image_url)        map[`${k}_image_url`]        = row.image_url
        })
        setF(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await Promise.all([
      upsert('hero_badge',          { title_en: f.hero_badge_title_en }),
      upsert('hero_title',          { title_en: f.hero_title_title_en }),
      upsert('hero_description',    { content_en: f.hero_description_content_en }),
      upsert('hero_badge_main',     { badge_text_en: f.hero_badge_main_badge_text_en, badge_subtext_en: f.hero_badge_main_badge_subtext_en }),
      upsert('hero_image',          { image_url: f.hero_image_image_url }),
      upsert('mission_title',       { title_en: f.mission_title_title_en }),
      upsert('mission_content',     { content_en: f.mission_content_content_en }),
      upsert('mission_image',       { image_url: f.mission_image_image_url }),
      upsert('mission_image_small', { image_url: f.mission_image_small_image_url }),
      upsert('roots_badge',         { title_en: f.roots_badge_title_en }),
      upsert('roots_title',         { title_en: f.roots_title_title_en }),
      upsert('roots_description',   { content_en: f.roots_description_content_en }),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#e8c547' }} />
    </div>
  )

  return (
    <div>
      <AdminHeader
        title="About Page"
        subtitle="Edit all content for the About page"
        onMenuClick={onMenuClick}
        action={
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" />
              : saved ? <CheckCircle className="w-4 h-4" />
              : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save all'}
          </button>
        }
      />

      <form onSubmit={handleSave}>
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-3">

          {/* Hero Text */}
          <Section title="Hero — Title & Text" icon="🌟" defaultOpen={true}>
            <div>
              <Label>Badge label — e.g. "Our Story"</Label>
              <Inp value={f.hero_badge_title_en ?? ''} onChange={e => set('hero_badge_title_en', e.target.value)} placeholder="Our Story" />
            </div>
            <div>
              <Label>Main title</Label>
              <Inp value={f.hero_title_title_en ?? ''} onChange={e => set('hero_title_title_en', e.target.value)} placeholder="About BySahara" />
            </div>
            <div>
              <Label>Description</Label>
              <Txtarea rows={3} value={f.hero_description_content_en ?? ''} onChange={e => set('hero_description_content_en', e.target.value)} placeholder="BySahara is more than a marketplace..." />
            </div>
          </Section>

          {/* Hero Badge */}
          <Section title="Hero — Gold Badge" icon="🏆">
            <div>
              <Label>Badge text — e.g. "100% Authentic"</Label>
              <Inp value={f.hero_badge_main_badge_text_en ?? ''} onChange={e => set('hero_badge_main_badge_text_en', e.target.value)} placeholder="100% Authentic" />
            </div>
            <div>
              <Label>Badge sub-text — e.g. "Est. 2020"</Label>
              <Inp value={f.hero_badge_main_badge_subtext_en ?? ''} onChange={e => set('hero_badge_main_badge_subtext_en', e.target.value)} placeholder="Est. 2020" />
            </div>
          </Section>

          {/* Hero Image */}
          <Section title="Hero — Right Image" icon="🖼️">
            <Label>Upload image</Label>
            <ImageUploader value={f.hero_image_image_url} onChange={url => set('hero_image_image_url', url)} folder="about" />
          </Section>

          {/* Mission */}
          <Section title="Mission — Who We Are" icon="🌿">
            <div>
              <Label>Section title</Label>
              <Inp value={f.mission_title_title_en ?? ''} onChange={e => set('mission_title_title_en', e.target.value)} placeholder="WHO WE ARE" />
            </div>
            <div>
              <Label>Content</Label>
              <Txtarea rows={4} value={f.mission_content_content_en ?? ''} onChange={e => set('mission_content_content_en', e.target.value)} placeholder="We empower local cooperatives..." />
            </div>
          </Section>

          {/* Mission Images */}
          <Section title="Mission — Images" icon="📸">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Large image</Label>
                <ImageUploader value={f.mission_image_image_url} onChange={url => set('mission_image_image_url', url)} folder="about" />
              </div>
              <div>
                <Label>Small image</Label>
                <ImageUploader value={f.mission_image_small_image_url} onChange={url => set('mission_image_small_image_url', url)} folder="about" />
              </div>
            </div>
          </Section>

          {/* Roots */}
          <Section title="Roots Section" icon="🏜️">
            <div>
              <Label>Badge — e.g. "Our Roots"</Label>
              <Inp value={f.roots_badge_title_en ?? ''} onChange={e => set('roots_badge_title_en', e.target.value)} placeholder="Our Roots" />
            </div>
            <div>
              <Label>Title</Label>
              <Inp value={f.roots_title_title_en ?? ''} onChange={e => set('roots_title_title_en', e.target.value)} placeholder="From the Heart of the Sahara" />
            </div>
            <div>
              <Label>Description</Label>
              <Txtarea rows={3} value={f.roots_description_content_en ?? ''} onChange={e => set('roots_description_content_en', e.target.value)} placeholder="Nestled in the golden sands..." />
            </div>
          </Section>

          {/* Save bottom */}
          <div className="flex justify-end pt-4 pb-8">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #e8c547, #c9a227)', color: '#0f172a' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" />
                : saved ? <CheckCircle className="w-4 h-4" />
                : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save all changes'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}