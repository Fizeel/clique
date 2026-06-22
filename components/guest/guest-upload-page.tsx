'use client'

import { useState } from 'react'
import { Camera, Images, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import type { AppEvent } from '@/lib/types'

type Status = 'idle' | 'uploading' | 'success' | 'error'

export default function GuestUploadPage({ event }: { event: AppEvent }) {
  const [status, setStatus] = useState<Status>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [guestName, setGuestName] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  function addFiles(list: FileList | null) {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list)])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (files.length === 0) return
    setStatus('uploading')
    setErrorMessage('')

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setCurrentFile(i + 1)
        setUploadProgress(Math.round((i / files.length) * 90))

        // 1. Pedir URL assinada
        const presignRes = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: event.slug,
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            guestName: guestName || null,
          }),
        })
        const presignData = await presignRes.json()
        if (!presignRes.ok) throw new Error(presignData.error || 'Falha ao preparar o envio')

        // 2. Enviar o arquivo direto pro R2
        const putRes = await fetch(presignData.presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })
        if (!putRes.ok) throw new Error('Falha ao enviar a foto')

        // 3. Confirmar e salvar no banco
        const confirmRes = await fetch('/api/upload/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: presignData.key,
            slug: event.slug,
            mimeType: file.type,
            fileSize: file.size,
            guestName: guestName || null,
          }),
        })
        const confirmData = await confirmRes.json()
        if (!confirmRes.ok) throw new Error(confirmData.error || 'Falha ao confirmar o envio')
      }

      setUploadProgress(100)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro inesperado')
      setStatus('error')
    }
  }

  function reset() {
    setFiles([])
    setUploadProgress(0)
    setCurrentFile(0)
    setErrorMessage('')
    setStatus('idle')
  }

  // ───────────── ESTADO: success ─────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 animate-fadeIn">
        <CheckCircle className="w-16 h-16 text-success mb-4 animate-checkPop" />
        <h1 className="font-serif text-2xl text-primary mb-2 text-center">Enviadas com sucesso! 🎉</h1>
        <p className="text-sm text-muted text-center mb-6">Suas fotos já estão no álbum.</p>
        <Button variant="outline" size="lg" className="w-full max-w-xs" onClick={reset}>
          Enviar mais fotos
        </Button>
      </div>
    )
  }

  // ───────────── ESTADO: error ─────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-danger mb-3" />
        <h1 className="text-lg font-medium text-center mb-1">Ops, algo deu errado</h1>
        <p className="text-sm text-muted text-center mb-5">{errorMessage}</p>
        <Button variant="outline" size="lg" className="w-full max-w-xs" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  // ───────────── ESTADO: idle / uploading ─────────────
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border z-10 py-3">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="font-serif text-sm text-primary/60 mb-0.5">Cliquê</div>
          <h1 className="font-serif text-xl text-primary">{event.name}</h1>
          {event.event_date && <p className="text-xs text-muted">{formatDate(event.event_date)}</p>}
        </div>
      </header>

      {/* CORPO */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-20">
        {event.custom_message && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 mb-5">
            <MessageCircle className="w-4 h-4 text-accent-dark inline mr-2" />
            <span className="text-sm text-muted-dark italic">{event.custom_message}</span>
          </div>
        )}

        {/* CAMPO NOME */}
        <div className="mb-5">
          <Input
            placeholder="Seu nome (opcional)"
            helpText="Para identificar suas fotos no álbum"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        {/* ÁREA DE UPLOAD */}
        {status === 'idle' && (
          <div className="mb-5 space-y-3">
            <label className="w-full py-5 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Camera className="w-8 h-8 text-muted" />
              <span className="text-sm font-medium text-muted">Tirar uma foto</span>
              <span className="text-xs text-muted/60">Usa a câmera do celular</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>

            <label className="w-full py-5 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Images className="w-8 h-8 text-muted" />
              <span className="text-sm font-medium text-muted">Escolher da galeria</span>
              <span className="text-xs text-muted/60">Selecionar fotos salvas</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        )}

        {/* PREVIEW */}
        {files.length > 0 && status === 'idle' && (
          <>
            <p className="text-xs text-muted font-medium mb-2">{files.length} foto(s) selecionada(s)</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {files.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label="Remover foto"
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ESTADO uploading */}
        {status === 'uploading' && (
          <div className="my-6">
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted text-center mt-3">
              Enviando foto {currentFile} de {files.length}...
            </p>
            <p className="text-xs text-muted/60 text-center">Não feche esta página</p>
          </div>
        )}

        {/* BOTÃO ENVIAR */}
        {status === 'idle' && (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={files.length === 0}
            onClick={handleUpload}
          >
            {files.length > 0 ? `Enviar ${files.length} foto(s) →` : 'Selecione as fotos acima'}
          </Button>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 bg-surface/80 backdrop-blur w-full py-3 text-center">
        <p className="text-xs text-muted/50">Powered by Cliquê · oclique.com.br</p>
      </footer>
    </div>
  )
}
