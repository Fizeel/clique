import { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

export function Textarea({ label, error, helpText, maxLength, className = '', disabled, value, ...props }: TextareaProps) {
  const baseClasses = 'w-full border rounded-xl px-4 py-3 text-sm bg-surface text-primary placeholder:text-muted/60 outline-none transition-all duration-200 resize-none min-h-[100px]'
  const stateClasses = error 
    ? 'border-danger focus:border-danger focus:ring-danger/20' 
    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/20'
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-background' : ''

  const length = typeof value === 'string' ? value.length : 0

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-muted-dark uppercase tracking-wide">{label}</label>}
      <textarea 
        className={`${baseClasses} ${stateClasses} ${disabledClasses}`} 
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        {...props} 
      />
      <div className="flex justify-between items-start mt-0.5">
        <div className="flex-1 flex flex-col">
          {error && <p className="text-xs text-danger">{error}</p>}
          {helpText && <p className="text-xs text-muted">{helpText}</p>}
        </div>
        {maxLength && (
          <span className="text-xs text-muted text-right ml-2 shrink-0">
            {length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
