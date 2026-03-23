import { cn } from '../../utils/cn'

export default function Card({
  children,
  hover = false,
  padding = true,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-pink-100/40 shadow-soft',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
