// src/data/packsData.ts
import { supabase } from '../lib/supabase'
import { Pack } from '../types'

export const getAllActivePacks = async (): Promise<Pack[]> => {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  if (error) { console.error(error); return [] }
  return (data ?? []) as Pack[]
}

export const getPacksByCooperative = async (cooperativeId: string): Promise<Pack[]> => {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('cooperative_id', cooperativeId)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  if (error) { console.error(error); return [] }
  return (data ?? []) as Pack[]
}