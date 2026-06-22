import { createClient } from '@/lib/supabase/server'
import { isEventExpired } from '@/lib/utils'
import GuestUploadPage from '@/components/guest/guest-upload-page'
import { Search, Lock } from 'lucide-react'
import type { AppEvent } from '@/lib/types'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('name').eq('slug', params.slug).maybeSingle()
  return { title: event ? event.name + ' · Cliquê' : 'Cliquê' }
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Search className="w-16 h-16 text-muted/30 mb-4" />
      <h1 className="font-serif text-2xl text-primary mb-2 text-center">Álbum não encontrado</h1>
      <p className="text-sm text-muted text-center max-w-xs">Verifique o QR Code e tente novamente.</p>
    </div>
  )
}

function EventClosedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Lock className="w-16 h-16 text-muted/30 mb-4" />
      <h1 className="font-serif text-2xl text-primary mb-2 text-center">Este álbum foi encerrado</h1>
      <p className="text-sm text-muted text-center max-w-xs">Obrigado por fazer parte! 💕</p>
    </div>
  )
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: eventData } = await supabase.from('events').select('*').eq('slug', params.slug).maybeSingle()

  if (!eventData) return <NotFoundPage />
  
  const event = eventData as AppEvent
  
  if (!event.is_active || isEventExpired(event.expires_at)) {
    return <EventClosedPage />
  }
  
  return <GuestUploadPage event={event} />
}
