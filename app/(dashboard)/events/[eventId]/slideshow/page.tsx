'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LayoutGrid, Maximize, X, Aperture } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Media } from '@/components/gallery/event-gallery'

export default function SlideshowPage({ params }: { params: { eventId: string } }) {
  const [photos, setPhotos] = useState<Media[]>([])
  const [mode, setMode] = useState<'grid' | 'spotlight'>('grid')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [eventName, setEventName] = useState('')
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    
    supabase.from('events')
      .select('name')
      .eq('id', params.eventId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setEventName(data.name)
      })

    supabase.from('media')
      .select('*')
      .eq('event_id', params.eventId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setPhotos(data as Media[])
      })

    const channel = supabase.channel('slideshow-' + params.eventId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'media',
        filter: 'event_id=eq.' + params.eventId
      }, (payload) => {
        const newMedia = payload.new as Media
        if (newMedia.is_approved) {
          setPhotos(prev => [newMedia, ...prev].slice(0, 20))
          setCurrentIndex(0)
          
          setNewPhotoIds(prev => {
            const next = new Set(prev)
            next.add(newMedia.id)
            return next
          })

          setTimeout(() => {
            setNewPhotoIds(prev => {
              const next = new Set(prev)
              next.delete(newMedia.id)
              return next
            })
          }, 3000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.eventId])

  useEffect(() => {
    if (mode === 'spotlight' && photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [mode, photos.length])

  const visiblePhotos = photos.slice(0, mode === 'grid' ? 9 : 1)

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none flex items-center justify-center">
      
      {mode === 'grid' && (
        <div className={`grid w-full h-full gap-0.5 bg-black ${photos.length <= 4 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {visiblePhotos.map(photo => (
            <div key={photo.id} className="relative overflow-hidden cursor-pointer group animate-fadeIn">
              <Image 
                src={photo.file_url} 
                alt="Foto" 
                fill 
                className="object-cover" 
              />
              {newPhotoIds.has(photo.id) && (
                <div className="absolute inset-0 ring-4 ring-white animate-pulse" />
              )}
              {photo.guest_name && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3">
                  <span className="text-white text-sm font-serif">{photo.guest_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === 'spotlight' && photos.length > 0 && (
        <div key={currentIndex} className="relative w-full h-full animate-fadeIn">
          <Image 
            src={photos[currentIndex].file_url} 
            alt="Spotlight" 
            fill 
            className="object-contain bg-black" 
          />
          {photos[currentIndex].guest_name && (
            <div className="absolute bottom-8 left-0 right-0 text-center text-white text-xl font-serif drop-shadow-lg animate-slideUp">
              {photos[currentIndex].guest_name}
            </div>
          )}
        </div>
      )}

      <div className="fixed top-4 left-4 pointer-events-none z-50">
        <span className="text-white/50 text-sm font-serif drop-shadow-md">
          Cliquê &middot; {eventName}
        </span>
      </div>

      <div className="fixed top-4 right-4 pointer-events-none z-50 flex items-center gap-1.5 drop-shadow-md">
        <Aperture className="w-4 h-4 text-white/50" />
        <span className="text-white/50 text-sm">{photos.length}</span>
      </div>

      <div className="group fixed bottom-0 right-0 p-8 z-50">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => setMode(mode === 'grid' ? 'spotlight' : 'grid')}
            className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            {mode === 'grid' ? (
              <Maximize className="w-5 h-5 text-white" />
            ) : (
              <LayoutGrid className="w-5 h-5 text-white" />
            )}
          </button>
          <button 
            onClick={() => window.close()}
            className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
