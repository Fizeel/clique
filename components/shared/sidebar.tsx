'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Aperture, LayoutDashboard, Images, PlusCircle, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'
import { Badge } from '@/components/ui/badge'

export interface Profile {
  id: string
  name: string
  email: string
  is_active: boolean
}

interface SidebarProps {
  profile: Profile
  onClose?: () => void
}

export function Sidebar({ profile, onClose }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Images, label: 'Meus Eventos' },
  ]

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-5 border-b border-border flex items-center">
        <Aperture className="w-6 h-6 text-primary" />
        <span className="font-serif text-xl text-primary ml-2">Cliquê</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== '/dashboard')
          const exactActive = pathname === link.href

          const active = link.href === '/dashboard' ? exactActive : isActive

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-dark hover:bg-border/50 hover:text-primary'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}

        <hr className="border-border my-3" />

        <Link
          href="/events/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-all w-full"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Evento
        </Link>
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {getInitials(profile?.name || profile?.email || '')}
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-sm font-medium text-primary truncate">
              {profile?.name || 'Usuário'}
            </span>
            <div className="mt-0.5">
              <Badge variant="accent">Cliquê</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-muted-dark hover:bg-surface hover:text-primary transition-all"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
          <button
            onClick={() => {
              signOut()
              onClose?.()
            }}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-muted-dark hover:bg-surface hover:text-primary transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
