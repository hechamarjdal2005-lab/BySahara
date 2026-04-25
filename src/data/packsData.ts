import { supabase } from '../lib/supabase'
import { Pack } from '../types'

export const getAllActivePacks = async (): Promise<Pack[]> => {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .neq('is_active', false)   // ✅ كيجيب true + null — مشي false فقط
    .order('order_index', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []) as Pack[]
}

export const getPacksByCooperative = async (cooperativeId: string): Promise<Pack[]> => {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('cooperative_id', cooperativeId)
    .neq('is_active', false)   // ✅ نفس الشيء هنا
    .order('order_index', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []) as Pack[]
}