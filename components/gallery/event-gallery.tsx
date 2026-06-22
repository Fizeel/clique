'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Presentation, Download, ImageOff, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { AppEvent } from '@/components/shared/event-card'
import { createClient } from '@/lib/supabase/client'

export interface Media {
  id: string
  event_id: string
  file_url: string
  mime_type: string
  guest_name: string | null
  is_approved: boolean
  created_at: string
}

interface EventGalleryProps {
  event: AppEvent
  initialMedia: Media[]
}

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString))
  } catch {
    return ''
  }
}

export function EventGallery({ event, initialMedia }: EventGalleryProps) {
  const [mediaItems, setMediaItems] = useState<Media[]>(initialMedia)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('event-' + event.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'media',
        filter: 'event_id=eq.' + event.id
      }, (payload) => {
        setMediaItems(prev => [payload.new as Media, ...prev])
        toast.success('Nova foto recebida! 📸')
      })
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [event.id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  const showNext = () => {
    if (lightboxIndex !== null && lightboxIndex < mediaItems.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  const showPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (diff > 50) showNext()
    else if (diff < -50) showPrev()
    touchStartX.current = null
  }

  async function handleDownloadAll() {
    if (mediaItems.length === 0) return
    
    setIsDownloading(true)
    toast('Preparando download...', { icon: '📦' })
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const folder = zip.folder('clique-' + event.slug)!
      
      for (let i = 0; i < mediaItems.length; i += 10) {
        const batch = mediaItems.slice(i, i + 10)
        await Promise.all(batch.map(async (m, j) => {
          try {
            const res = await fetch(m.file_url)
            const blob = await res.blob()
            const ext = m.mime_type.split('/')[1] || 'jpg'
            const name = 'foto-' + (i+j+1) + (m.guest_name ? '-' + m.guest_name.replace(/\s/g,'-') : '') + '.' + ext
            folder.file(name, blob)
          } catch(e) {
            console.error('Failed to download', m.file_url, e)
          }
        }))
      }
      
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'clique-' + event.slug + '.zip'
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('Download concluído!')
    } catch {
      toast.error('Erro ao gerar ZIP.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <span className="text-sm font-medium text-muted">
          📸 {mediaItems.length} fotos
        </span>
        <div className="flex gap-2">
          <Button 
            href={`/dashboard/events/${event.id}/slideshow`} 
            target="_blank"
            variant="ghost" 
            size="sm" 
            icon={<Presentation className="w-4 h-4" />}
          >
            Slideshow
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Download className="w-4 h-4" />} 
            loading={isDownloading} 
            onClick={handleDownloadAll}
            disabled={mediaItems.length === 0}
          >
            Baixar tudo
          </Button>
        </div>
      </div>

      {mediaItems.length === 0 ? (
        <div className="py-16 text-center bg-surface border border-border rounded-2xl">
          <ImageOff className="w-12 h-12 text-muted/30 mx-auto mb-3" />
          <h3 className="text-base font-medium text-muted">Aguardando fotos dos convidados...</h3>
          <p className="text-sm text-muted/70">Compartilhe o QR Code para que as fotos comecem a aparecer aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {mediaItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group animate-fadeIn"
              onClick={() => setLightboxIndex(index)}
            >
              <Image 
                src={item.file_url} 
                alt={item.guest_name || 'Foto do evento'} 
                fill 
                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-2">
                {item.guest_name && (
                  <span className="text-xs text-white font-medium truncate drop-shadow-md">
                    {item.guest_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {lightboxIndex > 0 && (
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {lightboxIndex < mediaItems.length - 1 && (
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); showNext(); }}
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          <div className="relative w-full h-full" onClick={() => setLightboxIndex(null)}>
            <Image 
              src={mediaItems[lightboxIndex].file_url} 
              alt={mediaItems[lightboxIndex].guest_name || 'Foto'} 
              fill 
              className="object-contain p-4" 
            />
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            {mediaItems[lightboxIndex].guest_name && (
              <p className="text-white text-sm font-medium drop-shadow-lg">
                {mediaItems[lightboxIndex].guest_name}
              </p>
            )}
            <p className="text-white/60 text-xs drop-shadow-lg">
              {formatDate(mediaItems[lightboxIndex].created_at)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
