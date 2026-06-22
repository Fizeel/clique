'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <AlertCircle className="w-16 h-16 text-danger mb-4" />
      <h2 className="font-serif text-2xl text-primary mb-2">Ops, algo deu errado</h2>
      <p className="text-sm text-muted mb-6 max-w-sm">
        Ocorreu um erro inesperado ao carregar esta página. Nossa equipe já foi notificada.
      </p>
      <Button variant="outline" size="lg" onClick={() => reset()}>
        Tentar novamente
      </Button>
    </div>
  )
}
