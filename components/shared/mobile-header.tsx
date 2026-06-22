'use client'

import { Aperture, Menu } from 'lucide-react'

interface MobileHeaderProps {
  onMenuOpen: () => void
  className?: string
}

export function MobileHeader({ onMenuOpen, className = '' }: MobileHeaderProps) {
  return (
    <header className={`sticky top-0 h-14 bg-surface/95 backdrop-blur border-b border-border shadow-sm z-30 ${className}`}>
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Aperture className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg text-primary ml-2">Cliquê</span>
        </div>
        <button 
          onClick={onMenuOpen}
          className="p-2 -mr-2 text-muted hover:text-primary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
