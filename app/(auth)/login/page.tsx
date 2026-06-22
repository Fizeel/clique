'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Aperture, Mail, Lock, Loader2 } from 'lucide-react'
import { signIn } from '@/lib/actions/auth'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-white w-full rounded-xl h-12 font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mt-2"
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? 'Entrando...' : 'Entrar na minha conta →'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, null)
  const [showForgot, setShowForgot] = useState(false)

  return (
    <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <Aperture className="w-8 h-8 text-primary mb-2" />
        <h1 className="font-serif text-3xl text-primary">Cliquê</h1>
        <p className="text-sm text-muted text-center mt-1">O álbum de quem você ama</p>
      </div>

      <div className="border-t border-border my-5"></div>

      <h2 className="text-lg font-medium text-primary mb-4">Acesse sua conta</h2>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-primary">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="email"
              name="email"
              required
              placeholder="seu@email.com"
              className="w-full h-12 rounded-xl border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary/20 pl-10 pr-4 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-primary">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full h-12 rounded-xl border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary/20 pl-10 pr-4 transition-colors"
            />
          </div>
        </div>

        {state?.error && (
          <div className="text-xs text-danger bg-danger/5 rounded-lg p-3">
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>

      <div className="text-center text-xs text-muted space-y-2 mt-6 flex flex-col items-center">
        <button 
          type="button"
          onClick={() => setShowForgot(!showForgot)}
          className="hover:text-primary transition-colors"
        >
          Esqueceu sua senha?
        </button>

        {showForgot && (
          <form 
            onSubmit={async (e) => {
              e.preventDefault()
              const email = new FormData(e.currentTarget).get('email')
              const btn = e.currentTarget.querySelector('button')
              if(btn) {
                btn.disabled = true
                btn.textContent = 'Enviando...'
              }
              await fetch('/api/auth/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              })
              if(btn) {
                btn.textContent = 'Email enviado!'
              }
            }}
            className="w-full mt-2 flex flex-col gap-2"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                name="email"
                required
                placeholder="Digite seu email"
                className="w-full h-10 rounded-lg border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary/20 pl-9 pr-3 transition-colors text-sm"
              />
            </div>
            <button 
              type="submit"
              className="h-10 w-full rounded-lg bg-surface border border-border text-primary font-medium hover:bg-accent/5 transition-colors disabled:opacity-50"
            >
              Enviar link
            </button>
          </form>
        )}
      </div>

      <div className="bg-accent/10 rounded-lg p-3 text-xs text-muted-dark mt-6 flex gap-2">
        <span className="shrink-0">ℹ️</span>
        <p>Sua conta é criada automaticamente após a compra. Verifique seu email.</p>
      </div>
    </div>
  )
}
