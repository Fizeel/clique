import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Cliquê — O álbum de quem você ama',
  description: 'Álbum colaborativo para eventos. Convidados enviam fotos pelo celular, sem instalar nada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={cn(inter.variable, playfair.variable)}>
      <body className="font-sans bg-background">
        {children}
        <Toaster 
          toastOptions={{ duration: 3000 }}
          containerStyle={{ bottom: 80 }}
          position="bottom-center" 
        />
      </body>
    </html>
  )
}
