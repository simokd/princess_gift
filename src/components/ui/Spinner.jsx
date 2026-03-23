const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`
        rounded-full border-pink-200 border-t-pink-500 animate-spin
        ${sizes[size]}
        ${className}
      `}
    />
  )
}
