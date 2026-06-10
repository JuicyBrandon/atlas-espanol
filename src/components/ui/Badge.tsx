import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'error' | 'navy'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#1E2A3A]/8 text-[#1E2A3A]',
    gold: 'bg-[#F2C94C]/20 text-[#6F4E37]',
    success: 'bg-[#27AE60]/15 text-[#27AE60]',
    warning: 'bg-[#F2994A]/15 text-[#F2994A]',
    error: 'bg-[#EB5757]/15 text-[#EB5757]',
    navy: 'bg-[#1E2A3A] text-[#F8F4EC]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
