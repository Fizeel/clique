import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2/client'
import crypto from 'crypto'

// Gera uma URL de upload para a FOTO DE CAPA do evento.
// Diferente do presign de convidado, este exige usuário logado (dono).
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Sessão expirada. Faça login novamente.' }, { status: 401 })

    const { mimeType, fileSize } = await req.json()
    if (!mimeType || !fileSize) {
      return Response.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(mimeType)) {
      return Response.json({ error: 'Use uma imagem JPG, PNG ou WEBP.' }, { status: 400 })
    }

    const maxBytes = 8 * 1024 * 1024 // 8MB
    if (fileSize > maxBytes) {
      return Response.json({ error: 'Imagem muito grande. Máximo: 8MB.' }, { status: 400 })
    }

    const ext = mimeType.split('/')[1].replace('jpeg', 'jpg')
    const key = `covers/${user.id}/${crypto.randomUUID()}.${ext}`

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: mimeType,
      ContentLength: fileSize,
    })

    const presignedUrl = await getSignedUrl(r2, cmd, { expiresIn: 300 })
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    return Response.json({ presignedUrl, publicUrl })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
