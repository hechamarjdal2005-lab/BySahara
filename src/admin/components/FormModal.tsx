import React from 'react'
interface FormModalProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  loading?: boolean
  children: React.ReactNode
  submitLabel?: string
}

export default function FormModal({
  open, title, onClose, onSubmit, loading, children, submitLabel = 'Enregistrer'
}: FormModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {children}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] text-[#0f172a] font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable field components
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/40 focus:border-[#e8c547]/40 transition text-sm"
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/40 focus:border-[#e8c547]/40 transition text-sm resize-none"
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const { options, ...rest } = props
  return (
    <select
      {...rest}
      className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/40 transition text-sm"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}