import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { Resend } from 'resend'
import { generateTempPassword } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticar webhook via token no header
    const token = req.headers.get('x-hotmart-webhook-token')
    if (token !== process.env.HOTMART_WEBHOOK_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const event  = body?.event          // 'PURCHASE_COMPLETE' | 'PURCHASE_REFUNDED' etc.
    const email  = body?.data?.buyer?.email
    const name   = body?.data?.buyer?.name || 'Usuário'

    if (!email) return Response.json({ ok: true })

    const supabase = createAdminClient()

    // ── COMPRA APROVADA ─────────────────────────────
    if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {

      const { data: { users } } = await supabase.auth.admin.listUsers()
      const existing = users.find(u => u.email === email)

      if (existing) {
        await supabase.auth.admin.updateUserById(existing.id, { ban_duration: 'none' })
        await supabase.from('profiles').update({ is_active: true }).eq('id', existing.id)
        return Response.json({ ok: true })
      }

      const tempPassword = generateTempPassword(10)

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email, 
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: name }
      })

      if (createError || !newUser?.user) {
        return Response.json({ error: 'Erro ao criar usuário' }, { status: 500 })
      }

      // Enviar email com credenciais via Resend
      const firstName = name.split(' ')[0]
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: 'Seu acesso ao Cliquê está pronto! 📸',
        html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">'
            + '<div style="text-align:center;margin-bottom:24px">'
            + '<span style="font-family:Georgia,serif;font-size:28px;color:#8B5E52">Cliquê</span>'
            + '</div>'
            + '<h1 style="font-family:Georgia,serif;color:#8B5E52;font-size:22px;margin-bottom:8px">Bem-vindo(a), ' + firstName + '! 🎉</h1>'
            + '<p style="color:#78716C;line-height:1.6;margin-bottom:20px">Sua conta foi criada com sucesso. Use as credenciais abaixo para acessar:</p>'
            + '<div style="background:#FAFAF8;border:1px solid #EBE8E3;border-radius:12px;padding:20px;margin-bottom:20px">'
            + '<p style="margin:0 0 8px;color:#44403C"><strong>Email:</strong> ' + email + '</p>'
            + '<p style="margin:0;color:#44403C"><strong>Senha temporária:</strong> <code style="background:#EBE8E3;padding:2px 8px;border-radius:4px;font-family:monospace">' + tempPassword + '</code></p>'
            + '</div>'
            + '<p style="color:#78716C;font-size:14px;margin-bottom:24px">Recomendamos alterar sua senha após o primeiro acesso em Configurações.</p>'
            + '<a href="' + process.env.NEXT_PUBLIC_APP_URL + '/login" '
            + 'style="display:inline-block;background:#8B5E52;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:500">'
            + 'Acessar minha conta →</a>'
            + '<hr style="margin:32px 0;border:none;border-top:1px solid #EBE8E3"/>'
            + '<p style="color:#A8A29E;font-size:12px;text-align:center">Cliquê · O álbum de quem você ama · suporte@oclique.com.br</p>'
            + '</div>'
      })

      return Response.json({ ok: true })
    }

    // ── REEMBOLSO / CHARGEBACK ──────────────────────
    if (event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_CHARGEBACK') {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find(u => u.email === email)
      
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, { ban_duration: '876000h' }) // Banido por 100 anos
        await supabase.from('profiles').update({ is_active: false }).eq('id', user.id)
      }
      return Response.json({ ok: true })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
