const variants = {
  pink: 'bg-pink-50 text-pink-600 border-pink-200',
  neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  error: 'bg-red-50 text-red-600 border-red-200',
  gold: 'bg-amber-50 text-amber-600 border-amber-200',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
}

export default function Badge({
  children,
  variant = 'pink',
  size = 'md',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
