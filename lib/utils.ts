import { clsx, type ClassValue } from 'clsx'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return clsx(...classes)
}

export function generateSlug(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'e')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return base + '-' + suffix
}

export function formatFileSize(b: number): string {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1).replace('.', ',') + ' KB'
  return (b / 1048576).toFixed(1).replace('.', ',') + ' MB'
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getEventTypeLabel(t: import('./types').EventType): string {
  const m: Record<import('./types').EventType, string> = {
    wedding: 'Casamento',
    birthday: 'Aniversário',
    graduation: 'Formatura',
    baby_shower: 'Chá de Bebê',
    anniversary: 'Bodas',
    corporate: 'Corporativo',
    other: 'Outro',
  }
  return m[t] ?? 'Evento'
}

export function isEventExpired(expires_at: string | null): boolean {
  if (!expires_at) return false
  return new Date(expires_at) < new Date()
}

export function getFileTypeFromMime(mime: string): import('./types').MediaType | null {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return null
}

export function generateTempPassword(len = 10): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from(
    { length: len },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}
