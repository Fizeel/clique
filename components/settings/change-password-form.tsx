'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Senha atualizada com sucesso!')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Nova senha</label>
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minímo 6 caracteres"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Confirmar nova senha</label>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repita a senha"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={loading}>
          Atualizar senha
        </Button>
      </div>
    </form>
  )
}
