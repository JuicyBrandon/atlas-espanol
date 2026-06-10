import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'navy' | 'glass'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-[#1E2A3A]/8 shadow-[0_2px_16px_rgba(30,42,58,0.06)]',
    gold: 'bg-[#F2C94C]/10 border border-[#F2C94C]/40',
    navy: 'bg-[#1E2A3A] text-[#F8F4EC]',
    glass: 'bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(30,42,58,0.08)]',
  }

  return (
    <div
      className={cn('rounded-2xl p-5', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-[#1E2A3A] tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}
