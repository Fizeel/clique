import { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  error?: string
  helpText?: string
}

export function Select({ label, options, error, helpText, className = '', disabled, ...props }: SelectProps) {
  const baseClasses = 'w-full border rounded-xl px-4 py-3 text-sm bg-surface text-primary placeholder:text-muted/60 outline-none transition-all duration-200 h-12 appearance-none'
  const stateClasses = error 
    ? 'border-danger focus:border-danger focus:ring-danger/20' 
    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/20'
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-background' : ''

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-muted-dark uppercase tracking-wide">{label}</label>}
      <div className="relative">
        <select 
          className={`${baseClasses} ${stateClasses} ${disabledClasses}`} 
          disabled={disabled}
          {...props} 
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      {helpText && <p className="text-xs text-muted mt-0.5">{helpText}</p>}
    </div>
  )
}
