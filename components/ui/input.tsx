import { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  icon?: ReactNode
}

export function Input({ label, error, helpText, icon, className = '', disabled, ...props }: InputProps) {
  const baseClasses = 'w-full border rounded-xl px-4 py-3 text-sm bg-surface text-primary placeholder:text-muted/60 outline-none transition-all duration-200 h-12'
  const stateClasses = error 
    ? 'border-danger focus:border-danger focus:ring-danger/20' 
    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/20'
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-background' : ''
  const iconClasses = icon ? 'pl-10' : ''

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-muted-dark uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4">{icon}</span>}
        <input 
          className={`${baseClasses} ${stateClasses} ${disabledClasses} ${iconClasses}`} 
          disabled={disabled}
          {...props} 
        />
      </div>
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      {helpText && <p className="text-xs text-muted mt-0.5">{helpText}</p>}
    </div>
  )
}
