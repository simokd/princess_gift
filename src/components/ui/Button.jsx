import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 shadow-card hover:shadow-md',
  secondary:
    'bg-pink-50 text-pink-600 hover:bg-pink-100 active:bg-pink-200',
  outline:
    'border border-pink-300 text-pink-500 hover:bg-pink-50 active:bg-pink-100',
  ghost:
    'text-pink-500 hover:bg-pink-50 active:bg-pink-100',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3 text-base rounded-lg gap-2.5',
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
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-smooth
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
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
