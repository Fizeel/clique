import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ error: 'Email obrigatório' }, { status: 400 })

    const supabase = await createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/reset-password'
    })

    // Sempre retornar ok (não revelar se email existe ou não)
    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ ok: true })
  }
}
