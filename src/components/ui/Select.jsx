import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    placeholder = '',
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
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-xl',
            'bg-white border appearance-none',
            'transition-all duration-200 cursor-pointer outline-none pe-10',
            error
              ? 'border-error focus:ring-2 focus:ring-red-100 focus:border-error'
              : 'border-neutral-200 focus:ring-2 focus:ring-pink-100 focus:border-pink-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
})

export default Select
