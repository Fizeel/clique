import Image from 'next/image'
import Link from 'next/link'
import { Camera, Images, Video, QrCode } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AppEvent } from '@/lib/types'

export type { AppEvent }

function formatDate(dateString: string | null) {
  if (!dateString) return "Data não definida"
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dateString))
  } catch (e) {
    return dateString
  }
}

function getEventTypeLabel(type: string) {
  const map: Record<string, string> = {
    wedding: 'Casamento',
    birthday: 'Aniversário',
    corporate: 'Corporativo',
    other: 'Outro'
  }
  return map[type] || 'Evento'
}

function isEventExpired(expiresAt: string | null) {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() < Date.now()
}

interface EventCardProps {
  event: AppEvent
}

export function EventCard({ event }: EventCardProps) {
  const expired = isEventExpired(event.expires_at)
  
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative aspect-video">
        {event.cover_image_url ? (
          <Image src={event.cover_image_url} alt={event.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center">
            <Camera className="w-10 h-10 text-primary/40" />
          </div>
        )}
        
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40" />

        <div className="absolute top-3 left-3">
          <Badge variant="accent">{getEventTypeLabel(event.event_type)}</Badge>
        </div>

        <div className="absolute top-3 right-3">
          {expired ? (
            <Badge variant="danger">Expirado</Badge>
          ) : event.is_active ? (
            <span className="w-2.5 h-2.5 bg-success rounded-full ring-2 ring-white animate-pulse block" />
          ) : (
            <span className="w-2.5 h-2.5 bg-muted/60 rounded-full ring-2 ring-white block" />
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-serif font-medium text-primary truncate mb-0.5">{event.name}</h3>
        <p className="text-xs text-muted">{formatDate(event.event_date)}</p>

        <div className="mt-2 flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5"><Images className="w-4 h-4" /> {event.photo_count} fotos</span>
          {event.allow_videos && (
            <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {event.video_count} vídeos</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 mt-auto">
          <Link href={`/events/${event.id}`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className="w-full" icon={<Images className="w-4 h-4" />}>
              Ver galeria
            </Button>
          </Link>
          <Link href={`/events/${event.id}#qrcode`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className="w-full" icon={<QrCode className="w-4 h-4" />}>
              QR Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
