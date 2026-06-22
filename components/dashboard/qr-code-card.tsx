'use client'

import { useState } from 'react'
import { AppEvent } from '@/components/shared/event-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, Edit } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toggleEventStatus, deleteEvent } from '@/lib/actions/events'

function formatDate(dateString: string | null) {
  if (!dateString) return "Não expira"
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(dateString))
  } catch (e) {
    return dateString
  }
}

interface QrCodeCardProps {
  event: AppEvent
}

export function QrCodeCard({ event }: QrCodeCardProps) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oclique.com.br'
  const eventUrl = `${APP_URL}/e/${event.slug}`

  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg') as SVGElement | null
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 0, 0, 400, 400)
      const a = document.createElement('a')
      a.download = `qrcode-${event.slug}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      alert("Link copiado com sucesso!")
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await toggleEventStatus(event.id, !event.is_active)
      window.location.reload() // Reloading to reflect the state easily
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
      setIsDeleting(true)
      await deleteEvent(event.id)
    }
  }

  return (
    <Card padding="md" className="text-center">
      <h3 className="text-sm font-medium text-muted mb-4">Compartilhe com seus convidados</h3>
      
      <div id="qr-code-wrapper" className="inline-block p-4 bg-white rounded-2xl border-2 border-border">
        <QRCodeSVG 
          id="qr-code-svg"
          value={eventUrl}
          size={200}
          fgColor="#8B5E52"
          bgColor="#FFFFFF"
        />
      </div>

      <p className="text-xs text-muted font-mono truncate mt-3 mb-4 px-2">
        {eventUrl.replace('https://', '')}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          icon={<Copy className="w-4 h-4" />} 
          onClick={copyLink}
        >
          Copiar link
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          icon={<Download className="w-4 h-4" />} 
          onClick={downloadQR}
        >
          Baixar PNG
        </Button>
      </div>

      <div className="border-t border-border pt-4"></div>

      <div className="text-left space-y-1.5 text-xs text-muted mb-4">
        <p className="flex items-center gap-2">
          Status: 
          <span className="flex items-center gap-1 font-medium">
            <span className={`w-2 h-2 rounded-full ${event.is_active ? 'bg-success' : 'bg-muted/60'}`} />
            {event.is_active ? 'Ativo' : 'Pausado'}
          </span>
        </p>
        <p>Expira em: <span className="font-medium text-muted-dark">{formatDate(event.expires_at)}</span></p>
        <p>Fotos: <span className="font-medium text-muted-dark">{event.photo_count} recebidas</span></p>
      </div>

      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleToggle}
          loading={isToggling}
        >
          {event.is_active ? 'Pausar evento' : 'Reativar evento'}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          icon={<Edit className="w-4 h-4" />}
          onClick={() => alert('Abrir modal de edição - Será implementado no próximo passo')}
        >
          Editar informações
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-danger hover:bg-danger/10 hover:text-danger"
          icon={<Trash2 className="w-4 h-4" />}
          onClick={handleDelete}
          loading={isDeleting}
        >
          Excluir evento
        </Button>
      </div>
    </Card>
  )
}
