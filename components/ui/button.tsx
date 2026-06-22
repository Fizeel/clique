import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import type { ReactNode, MouseEventHandler } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  title?: string
  onClick?: MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>
}

const base =
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-accent/20 text-primary hover:bg-accent/30 border border-accent/30',
  outline: 'border border-border text-muted-dark hover:border-primary hover:text-primary bg-transparent',
  ghost: 'text-muted-dark hover:bg-surface hover:text-primary',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs py-1.5 px-3 rounded-lg gap-1.5',
  md: 'text-sm py-2.5 px-5 rounded-xl gap-2',
  lg: 'text-base py-3 px-6 rounded-xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  href,
  target,
  rel,
  type = 'button',
  disabled,
  title,
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()

  const content = (
    <>
      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : icon}
      {loading ? 'Aguarde...' : children}
    </>
  )

  // Com href → renderiza link; sem href → botão normal
  if (href) {
    const isExternal = /^(https?:|mailto:|tel:|#)/.test(href)
    const computedRel = target === '_blank' ? rel ?? 'noopener noreferrer' : rel

    if (isExternal) {
      return (
        <a href={href} target={target} rel={computedRel} className={cls} title={title} onClick={onClick}>
          {content}
        </a>
      )
    }

    return (
      <Link href={href} target={target} rel={computedRel} className={cls} title={title} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} disabled={disabled || loading} title={title} onClick={onClick}>
      {content}
    </button>
  )
}

export default Button