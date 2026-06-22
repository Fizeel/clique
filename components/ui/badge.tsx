import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'primary'
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseClasses = 'text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1'
  
  const variants = {
    default: 'bg-muted/10 text-muted-dark',
    success: 'bg-success/10 text-success',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/20 text-accent-dark',
    primary: 'bg-primary/10 text-primary'
  }

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
