import React from 'react'
interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onToggle?: (row: T) => void
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, loading, onEdit, onDelete, onToggle
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-4 border-[#e8c547]/20 border-t-[#e8c547] animate-spin" />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map(col => (
              <th key={String(col.key)} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete || onToggle) && (
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-white/2 transition group">
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-300">
                  {col.render
                    ? col.render(row)
                    : String((row as any)[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete || onToggle) && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onToggle && (
                      <button
                        onClick={() => onToggle(row)}
                        className={`text-xs px-2 py-1 rounded-lg transition ${
                          row.is_active
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                        }`}
                      >
                        {row.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                      >
                        Modifier
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}