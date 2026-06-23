import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus, Camera } from 'lucide-react'
import { EventCard, AppEvent } from '@/components/shared/event-card'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const events = (eventsData || []) as AppEvent[]

  return (
    <>
      <PageHeader
        title="Meus Eventos"
        subtitle="Todos os seus álbuns colaborativos em um só lugar"
        action={
          <Button href="/events/new" icon={<Plus className="w-4 h-4" />}>
            Criar novo evento
          </Button>
        }
      />

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
