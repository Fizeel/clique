import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChangePasswordForm } from '@/components/settings/change-password-form'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dateString))
  } catch {
    return dateString
  }
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader 
        title="Configurações" 
        subtitle="Gerencie sua conta e segurança" 
      />

      <Card padding="md">
        <h2 className="text-lg font-medium text-primary mb-4">Sua conta</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Nome</label>
              <div className="px-4 py-2.5 bg-background border border-border rounded-xl text-primary text-sm font-medium">
                {profile?.full_name || 'Não informado'}
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Email</label>
              <div className="px-4 py-2.5 bg-background border border-border rounded-xl text-primary text-sm font-medium truncate">
                {user.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div>
              <label className="block text-sm text-muted mb-1">Plano</label>
              <Badge variant="accent">Cliquê</Badge>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Membro desde</label>
              <span className="text-sm font-medium text-primary">
                {profile?.created_at ? formatDate(profile.created_at) : 'Recente'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted mt-5 pt-4 border-t border-border">
          Para alterar nome ou email: suporte@oclique.com.br
        </p>
      </Card>

      <Card padding="md">
        <h2 className="text-lg font-medium text-primary mb-4">Alterar senha</h2>
        <ChangePasswordForm />
      </Card>

      <Card padding="md" className="border-danger/20 bg-danger/5">
        <h2 className="text-lg font-medium text-danger mb-2">Sessão</h2>
        <p className="text-sm text-danger/80 mb-4">
          Ao sair, você será redirecionado para o login.
        </p>
        <form action={signOut}>
          <button 
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Encerrar sessão
          </button>
        </form>
      </Card>
    </div>
  )
}
