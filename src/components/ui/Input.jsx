import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Icon className="w-4 h-4 text-neutral-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-xl',
            'bg-white border transition-all duration-200',
            'placeholder:text-neutral-300 outline-none',
            Icon && 'ps-10',
            error
              ? 'border-error focus:ring-2 focus:ring-red-100 focus:border-error'
              : 'border-neutral-200 focus:ring-2 focus:ring-pink-100 focus:border-pink-400',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
})

export default Input
