import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
}) {
  const decrease = () => {
    if (value > min) onChange(value - 1)
  }

  const increase = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="inline-flex items-center border border-neutral-200 rounded-lg">
      <button
        onClick={decrease}
        disabled={value <= min}
        className="p-2 text-neutral-500 hover:text-pink-500 hover:bg-pink-50 rounded-s-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-neutral-700 select-none">
        {value}
      </span>
      <button
        onClick={increase}
        disabled={value >= max}
        className="p-2 text-neutral-500 hover:text-pink-500 hover:bg-pink-50 rounded-e-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
