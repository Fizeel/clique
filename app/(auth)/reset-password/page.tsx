'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { KeyRound, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Link expirado. Solicite um novo em /login')
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    setError('')
    
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  if (checkingSession) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm text-center animate-fadeIn">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-primary mb-2">Senha atualizada!</h2>
        <p className="text-sm text-muted">Redirecionando você para o painel...</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center mb-6">
        <KeyRound className="w-8 h-8 text-primary mb-4" />
        <h1 className="font-serif text-2xl text-primary text-center">Criar nova senha</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-primary">Nova senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="w-full h-12 rounded-xl border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-primary">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repita a senha"
            className="w-full h-12 rounded-xl border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 transition-colors"
          />
        </div>

        {error && (
          <div className="text-xs text-danger bg-danger/5 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
          Salvar nova senha
        </Button>
      </form>
    </div>
  )
}
