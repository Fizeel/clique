import { ShieldX, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SuspendedPage() {
  return (
    <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm text-center">
      <ShieldX className="w-12 h-12 text-danger mx-auto mb-4 block" />
      <h1 className="font-serif text-2xl text-primary mb-4">Acesso suspenso</h1>
      
      <p className="text-sm text-muted leading-relaxed mb-6">
        Identificamos um reembolso associado a esta conta.<br/>
        Se você acredita que houve um erro, entre em contato:
      </p>

      <div className="flex flex-col items-center gap-4">
        <a 
          href="mailto:suporte@oclique.com.br"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-border bg-transparent text-sm font-medium hover:bg-accent/5 transition-colors"
        >
          <Mail className="w-4 h-4" />
          suporte@oclique.com.br
        </a>

        <Link 
          href="/"
          className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-muted hover:text-primary hover:bg-accent/5 transition-colors"
        >
          &larr; Voltar para o início
        </Link>
      </div>
    </div>
  )
}
