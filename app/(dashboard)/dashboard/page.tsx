import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, CalendarHeart, Images, Activity, Sparkles, Camera } from 'lucide-react'
import { EventCard, AppEvent } from '@/components/shared/event-card'

function isEventExpired(expiresAt: string | null) {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() < Date.now()
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const events = (eventsData || []) as AppEvent[]

  const totalPhotos = events.reduce((s, e) => s + (e.photo_count || 0), 0)
  const activeEvents = events.filter(e => e.is_active && !isEventExpired(e.expires_at)).length
  const firstName = profile?.name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'você'

  return (
    <>
      <PageHeader 
        title={`Olá, ${firstName}! 👋`}
        subtitle="Gerencie seus eventos e acompanhe as fotos em tempo real"
        action={
          <Button href="/events/new" icon={<Plus className="w-4 h-4" />}>
            Criar novo evento
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-dark">Total de Eventos</span>
          </div>
          <div className="text-2xl font-serif text-primary">{events.length}</div>
          <div className="text-xs text-muted mt-1">eventos criados</div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Images className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-dark">Fotos Coletadas</span>
          </div>
          <div className="text-2xl font-serif text-primary">{totalPhotos}</div>
          <div className="text-xs text-muted mt-1">em todos os eventos</div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-dark">Eventos Ativos</span>
          </div>
          <div className="text-2xl font-serif text-primary">{activeEvents}</div>
          <div className="text-xs text-muted mt-1">recebendo fotos</div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-dark">Plano</span>
          </div>
          <div className="text-2xl font-serif text-primary">Cliquê</div>
          <div className="text-xs text-muted mt-1">
            <Badge variant="accent">Premium</Badge>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium text-primary mb-4">Seus Eventos</h2>

      {events.length === 0 ? (
        <div className="py-16 text-center">
          <Camera className="w-16 h-16 text-muted/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-muted mb-2">Nenhum evento criado ainda</h3>
          <p className="text-sm text-muted mb-6">Crie seu primeiro álbum colaborativo e compartilhe com seus convidados.</p>
          <Button href="/events/new" size="lg" icon={<Plus className="w-5 h-5" />}>
            Criar meu primeiro evento &rarr;
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  )
}
