import React from 'react'
interface ConfirmDialogProps {
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open, title = 'Confirmer la suppression', message = 'Cette action est irréversible. Voulez-vous continuer ?',
  onConfirm, onCancel, loading
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-2xl">
            🗑️
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition text-sm"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition text-sm disabled:opacity-50"
            >
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}