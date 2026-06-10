'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helper, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1E2A3A]">
            {label}
          </label>
        )}
        {helper && (
          <p className="text-xs text-[#6F4E37]/70">{helper}</p>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-[#1E2A3A] placeholder:text-[#1E2A3A]/40',
            'transition-all duration-150 outline-none',
            'border-[#1E2A3A]/15 hover:border-[#1E2A3A]/30 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20',
            error && 'border-[#EB5757] focus:border-[#EB5757] focus:ring-[#EB5757]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#EB5757]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
