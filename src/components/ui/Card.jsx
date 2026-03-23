export default function Card({
  children,
  hover = false,
  padding = true,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-pink-100/50
        shadow-card
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
