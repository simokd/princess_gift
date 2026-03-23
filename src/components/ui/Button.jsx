import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 shadow-md hover:shadow-lg',
  secondary:
    'bg-pink-50 text-pink-600 hover:bg-pink-100 active:bg-pink-200',
  outline:
    'border border-pink-200 text-pink-500 hover:bg-pink-50 active:bg-pink-100',
  ghost:
    'text-pink-500 hover:bg-pink-50 active:bg-pink-100',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3 text-base rounded-xl gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'start',
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 ease-smooth',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && Icon && iconPosition === 'start' && (
        <Icon className="w-4 h-4" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'end' && (
        <Icon className="w-4 h-4" />
      )}
    </button>
  )
}
