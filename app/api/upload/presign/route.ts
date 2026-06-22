import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2/client'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, eventId, mimeType, fileSize } = body
    
    const idOrSlug = slug || eventId

    if (!idOrSlug || !mimeType || !fileSize) {
      return Response.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif', 'image/jpg']
    if (!allowed.includes(mimeType)) {
      return Response.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    const query = supabase.from('events').select('id,is_active,expires_at,max_file_size_mb')
    if (slug) {
      query.eq('slug', slug)
    } else {
      query.eq('id', idOrSlug)
    }

    const { data: event } = await query.maybeSingle()

    if (!event) return Response.json({ error: 'Evento não encontrado' }, { status: 404 })
    if (!event.is_active) return Response.json({ error: 'Álbum encerrado' }, { status: 403 })
    if (event.expires_at && new Date(event.expires_at) < new Date()) {
      return Response.json({ error: 'Álbum expirado' }, { status: 403 })
    }

    const maxBytes = event.max_file_size_mb * 1024 * 1024
    if (fileSize > maxBytes) {
      return Response.json({ error: 'Arquivo muito grande. Máximo: ' + event.max_file_size_mb + 'MB' }, { status: 400 })
    }

    // Rate limiting (30 uploads/hora por IP por evento)
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('cf-connecting-ip') ?? 'unknown'
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 20)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

    const { data: rate } = await supabase.from('upload_rate_limits')
      .select('*')
      .eq('event_id', event.id)
      .eq('ip_hash', ipHash)
      .maybeSingle()

    if (rate) {
      if (rate.window_start > oneHourAgo && rate.upload_count >= 30) {
        return Response.json({ error: 'Limite atingido. Aguarde 1 hora.' }, { status: 429 })
      }
      if (rate.window_start > oneHourAgo) {
        await supabase.from('upload_rate_limits').update({ upload_count: rate.upload_count + 1 }).eq('id', rate.id)
      } else {
        await supabase.from('upload_rate_limits').update({ upload_count: 1, window_start: new Date().toISOString() }).eq('id', rate.id)
      }
    } else {
      await supabase.from('upload_rate_limits').insert({ event_id: event.id, ip_hash: ipHash })
    }

    const ext = mimeType.split('/')[1].replace('jpeg', 'jpg')
    const key = `events/${event.id}/${crypto.randomUUID()}.${ext}`
    
    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: mimeType,
      ContentLength: fileSize
    })
    
    const presignedUrl = await getSignedUrl(r2, cmd, { expiresIn: 300 })

    return Response.json({ presignedUrl, key })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
