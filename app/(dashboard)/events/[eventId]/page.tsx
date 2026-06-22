import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventGallery } from '@/components/gallery/event-gallery'
import { QrCodeCard } from '@/components/dashboard/qr-code-card'
import { AppEvent } from '@/components/shared/event-card'

export async function generateMetadata({ params }: { params: { eventId: string } }) {
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('name').eq('id', params.eventId).maybeSingle()
  return { title: event ? event.name + ' · Cliquê' : 'Cliquê' }
}

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: eventData } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.eventId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!eventData) {
    redirect('/dashboard') // não é dono
  }

  const event = eventData as AppEvent

  const { data: initialMedia } = await supabase
    .from('media')
    .select('*')
    .eq('event_id', event.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="min-w-0">
        <EventGallery event={event} initialMedia={initialMedia || []} />
      </div>

      <div className="hidden lg:block sticky top-6">
        <QrCodeCard event={event} />
      </div>

      <div className="block lg:hidden mt-4">
        <QrCodeCard event={event} />
      </div>
    </div>
  )
}
