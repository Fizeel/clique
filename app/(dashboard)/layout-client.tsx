'use client'

import { useState } from 'react'
import { Sidebar, Profile } from '@/components/shared/sidebar'
import { MobileHeader } from '@/components/shared/mobile-header'

interface DashboardLayoutClientProps {
  profile: Profile
  children: React.ReactNode
}

export function DashboardLayoutClient({ profile, children }: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-col shrink-0">
        <Sidebar profile={profile} />
      </aside>

      {/* Drawer mobile */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
            onClick={() => setOpen(false)} 
          />
          <aside className="fixed left-0 top-0 h-full w-64 z-50 md:hidden shadow-2xl animate-slideUp">
            <Sidebar profile={profile} onClose={() => setOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <MobileHeader className="md:hidden" onMenuOpen={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-14 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
