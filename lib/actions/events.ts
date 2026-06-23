'use server'

import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { redirect } from 'next/navigation'

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada. Faça login novamente.' }

  const name = (formData.get('name') as string)?.trim()
  if (!name || name.length < 3) return { error: 'Nome deve ter ao menos 3 caracteres.' }

  const slug = generateSlug(name)

  const { data: event, error } = await supabase.from('events').insert({
    user_id:         user.id,
    slug,
    name,
    event_type:      formData.get('event_type') || 'wedding',
    event_date:      formData.get('event_date') || null,
    custom_message:  (formData.get('custom_message') as string)?.trim() || null,
    allow_videos:    false,
    max_file_size_mb: 10,
  }).select().single()

  if (error) return { error: 'Erro ao criar evento. Tente novamente.' }
  redirect('/events/' + event.id)
}

export async function updateEvent(eventId: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('events').update({
    name:           formData.get('name'),
    event_type:     formData.get('event_type'),
    event_date:     formData.get('event_date') || null,
    custom_message: formData.get('custom_message') || null,
  }).eq('id', eventId)
  if (error) return { error: 'Erro ao salvar.' }
  return { success: true }
}

export async function toggleEventStatus(eventId: string, is_active: boolean) {
  const supabase = await createClient()
  await supabase.from('events').update({ is_active }).eq('id', eventId)
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  await supabase.from('events').delete().eq('id', eventId)
  redirect('/dashboard')
}
