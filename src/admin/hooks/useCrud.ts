import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export function useCrud<T extends { id: any }>(table: string, orderBy = 'created_at') {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data: rows, error: err } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending: true })
    if (err) setError(err.message)
    else setData(rows as T[])
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => { fetch() }, [fetch])

  const create = async (payload: Partial<T>) => {
    const { data: row, error: err } = await supabase.from(table).insert(payload).select().single()
    if (err) return { error: err.message }
    setData(prev => [...prev, row as T])
    return { data: row }
  }

  const update = async (id: any, payload: Partial<T>) => {
    const { data: row, error: err } = await supabase.from(table).update(payload).eq('id', id).select().single()
    if (err) return { error: err.message }
    setData(prev => prev.map(item => item.id === id ? row as T : item))
    return { data: row }
  }

  const remove = async (id: any) => {
    const { error: err } = await supabase.from(table).delete().eq('id', id)
    if (err) return { error: err.message }
    setData(prev => prev.filter(item => item.id !== id))
    return { data: true }
  }

  const toggleActive = async (id: any, current: boolean) => {
    return update(id, { is_active: !current } as any)
  }

  return { data, loading, error, refetch: fetch, create, update, remove, toggleActive }
}