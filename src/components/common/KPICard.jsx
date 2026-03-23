export default function KPICard({ icon: Icon, label, value, trend, color = 'pink' }) {
  const colors = {
    pink: 'bg-pink-50 text-pink-500',
    green: 'bg-emerald-50 text-emerald-500',
    blue: 'bg-blue-50 text-blue-500',
    amber: 'bg-amber-50 text-amber-500',
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-neutral-900 mb-1">{value}</p>
      <p className="text-sm text-neutral-500 m-0">{label}</p>
    </div>
  )
}
