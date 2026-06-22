import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(req: NextRequest) {
  try {
    const { key, slug, eventId, mimeType, fileSize, guestName } = await req.json()
    
    const idOrSlug = slug || eventId

    if (!key || !idOrSlug || !mimeType) {
      return Response.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    const query = supabase.from('events').select('id')
    if (slug) {
      query.eq('slug', slug)
    } else {
      query.eq('id', idOrSlug)
    }
    
    const { data: event } = await query.maybeSingle()

    if (!event) return Response.json({ error: 'Evento não encontrado' }, { status: 404 })

    if (!key.startsWith(`events/${event.id}/`)) {
      return Response.json({ error: 'Chave inválida' }, { status: 403 })
    }

    const file_type = mimeType.startsWith('image/') ? 'image' : 'video'
    const file_url  = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    const { data: media, error } = await supabase.from('media').insert({
      event_id: event.id, 
      storage_key: key, 
      file_url, 
      file_type,
      file_size_bytes: Number(fileSize), 
      mime_type: mimeType,
      guest_name: guestName || null,
      is_approved: true // Por padrão a foto já entra aprovada e visível no slideshow
    }).select().single()

    if (error) {
      console.error(error)
      return Response.json({ error: 'Erro ao salvar metadados da mídia' }, { status: 500 })
    }
    
    return Response.json({ success: true, media })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
