'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto mx-0 sm:mx-4 transform transition animate-slideUp sm:animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="font-serif text-lg text-primary">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-accent/10 ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
