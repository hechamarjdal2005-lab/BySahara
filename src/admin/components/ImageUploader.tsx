import React from 'react'
import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
}

export default function ImageUploader({
  value, onChange, bucket = 'images', folder = 'uploads'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: true })

    if (uploadError) {
      setError('Erreur lors du téléchargement')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-white text-xs px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="URL de l'image ou télécharger..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/40 text-sm transition"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 rounded-xl bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/20 hover:bg-[#e8c547]/20 transition text-sm font-medium disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? '⏳' : '📁 Télécharger'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}