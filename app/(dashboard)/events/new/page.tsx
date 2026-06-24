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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oclique.top'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" loading={pending} size="lg" className="w-full mt-2">
      Criar evento &rarr;
    </Button>
  )
}

export default function NewEventPage() {
  const [state, formAction] = useFormState(createEvent, null)
  const [name, setName] = useState('')

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

              <SubmitButton />
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
