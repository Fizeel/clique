import { Aperture } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    images: ['/opengraph-image.png'],
  },
}

const HOTMART_CHECKOUT_URL = process.env.NEXT_PUBLIC_HOTMART_URL || 'https://pay.hotmart.com/N106442439E?off=9pihhr06&checkoutMode=10'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <nav className="sticky top-0 bg-surface/95 backdrop-blur border-b border-border z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Aperture className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl text-primary ml-2">Cliquê</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" href="/login">
              Entrar
            </Button>
            <Button variant="primary" size="sm" href={HOTMART_CHECKOUT_URL} target="_blank">
              Comprar agora
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-surface border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-2">
              <Aperture className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg text-primary ml-2">Cliquê</span>
            </div>
            <p className="text-sm text-muted">O álbum de quem você ama</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="#como-funciona" className="text-sm text-muted hover:text-primary transition-colors">
              Como funciona
            </Link>
            <Link href="#planos" className="text-sm text-muted hover:text-primary transition-colors">
              Preço
            </Link>
            <Link href="#faq" className="text-sm text-muted hover:text-primary transition-colors">
              Perguntas
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <a href="mailto:suporte@oclique.top" className="text-sm text-muted hover:text-primary transition-colors">
              suporte@oclique.top
            </a>
            <a href="https://instagram.com/oclique" target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg> @oclique
            </a>
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-8 pt-8 border-t border-border/50 max-w-5xl mx-auto px-4">
          © {new Date().getFullYear()} Cliquê &middot; Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
