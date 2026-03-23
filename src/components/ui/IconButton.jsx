const variants = {
  default: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
  pink: 'text-pink-400 hover:text-pink-600 hover:bg-pink-50',
  danger: 'text-neutral-400 hover:text-error hover:bg-red-50',
}

const sizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
}

export default function IconButton({
  icon: Icon,
  variant = 'default',
  size = 'md',
  active = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-200 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${active ? 'bg-pink-50 text-pink-500' : ''}
        ${className}
      `}
      {...props}
    >
      <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
    </button>
  )
}
