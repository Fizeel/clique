'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { createEvent } from '@/lib/actions/events'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { useFormStatus } from 'react-dom'
import { ImagePlus, Loader2 } from 'lucide-react'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oclique.top'

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" loading={pending} disabled={disabled} size="lg" className="w-full mt-2">
      Criar evento &rarr;
    </Button>
  )
}

export default function NewEventPage() {
  const [state, formAction] = useFormState(createEvent, null)
  const [name, setName] = useState('')

  const [coverUrl, setCoverUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverError, setCoverError] = useState('')

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverError('')

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setCoverError('Use uma imagem JPG, PNG ou WEBP.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setCoverError('Imagem muito grande (máx. 8MB).')
      return
    }

    setCoverPreview(URL.createObjectURL(file))
    setUploadingCover(true)
    try {
      const res = await fetch('/api/upload/cover-presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mimeType: file.type, fileSize: file.size }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao preparar o envio.')

      const put = await fetch(data.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!put.ok) throw new Error('Falha ao enviar a imagem. Tente novamente.')

      setCoverUrl(data.publicUrl)
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : 'Erro ao enviar imagem.')
      setCoverPreview('')
    } finally {
      setUploadingCover(false)
    }
  }

  const slugPreview = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Criar novo evento"
        subtitle="Configure seu álbum colaborativo em segundos"
        action={
          <Button variant="ghost" href="/dashboard">
            &larr; Voltar
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <Card padding="md">
            <form action={formAction} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-dark uppercase tracking-wide">
                  Foto de capa <span className="text-muted/60 normal-case font-normal">(opcional)</span>
                </label>
                <label className="mt-1.5 relative flex items-center justify-center aspect-video w-full rounded-xl border-2 border-dashed border-border bg-background cursor-pointer overflow-hidden hover:border-primary/40 transition-colors">
                  {coverPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={coverPreview} alt="Prévia da capa" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-muted px-4 py-6">
                      <ImagePlus className="w-7 h-7 mx-auto mb-1.5 text-primary/50" />
                      <span className="text-sm">Toque para escolher uma foto</span>
                      <p className="text-[11px] text-muted/70 mt-0.5">JPG, PNG ou WEBP · até 8MB</p>
                    </div>
                  )}
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleCoverChange}
                    disabled={uploadingCover}
                  />
                </label>
                {coverError && <p className="text-xs text-danger mt-1">{coverError}</p>}
                <input type="hidden" name="cover_image_url" value={coverUrl} />
              </div>

              <div>
                <Input
                  label="Nome do evento"
                  name="name"
                  required
                  placeholder="Casamento Ana & João"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted/70 mt-1 ml-1">
                  Link: oclique.top/e/{slugPreview || 'nome-do-evento'}-XXXX
                </p>
              </div>

              <Select
                label="Tipo de Evento"
                name="event_type"
                options={[
                  { value: 'wedding', label: 'Casamento' },
                  { value: 'birthday', label: 'Aniversário' },
                  { value: 'graduation', label: 'Formatura' },
                  { value: 'baby_shower', label: 'Chá de Bebê' },
                  { value: 'anniversary', label: 'Bodas' },
                  { value: 'corporate', label: 'Corporativo' },
                  { value: 'other', label: 'Outro' },
                ]}
              />

              <Input
                type="date"
                label="Data do Evento"
                name="event_date"
              />

              <Textarea
                label="Mensagem para os Convidados"
                name="custom_message"
                rows={3}
                maxLength={200}
                placeholder="Olá! Que alegria ter você aqui! 📸 Envie suas fotos e ajude a construir este álbum especial."
              />

              {state?.error && (
                <div className="bg-danger/5 border border-danger/20 rounded-xl p-3 text-sm text-danger mt-2">
                  {state.error}
                </div>
              )}

              <SubmitButton disabled={uploadingCover} />
            </form>
          </Card>
        </div>

        <div className="relative">
          <div className="sticky top-6">
            <Card padding="md" className="text-center">
              <h3 className="text-sm font-medium text-muted mb-4">Preview do QR Code</h3>

              <div className="inline-block p-4 bg-white rounded-xl border border-border">
                <QRCodeSVG
                  value={`${APP_URL}/e/${slugPreview || 'seu-evento'}`}
                  size={180}
                  fgColor="#8B5E52"
                  bgColor="#FFFFFF"
                />
              </div>

              <p className="text-xs text-muted mt-3">
                O QR Code definitivo estará disponível após criar o evento.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
