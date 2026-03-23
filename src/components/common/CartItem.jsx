import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import QuantitySelector from '../ui/QuantitySelector'
import IconButton from '../ui/IconButton'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function CartItem({ item }) {
  const { i18n } = useTranslation()
  const { updateQuantity, removeItem } = useCart()

  const title =
    i18n.language === 'ar'
      ? item.titleAr || item.title
      : i18n.language === 'fr'
        ? item.titleFr || item.title
        : item.title

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-b-0">
      {/* Image */}
      <Link to={`/products/${item.id}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-pink-50/50">
          <img src={item.image} alt={title} className="w-full h-full object-cover" />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.id}`} className="no-underline">
          <h4 className="text-sm font-medium text-neutral-800 truncate hover:text-pink-500 transition-colors m-0">
            {title}
          </h4>
        </Link>

        {/* Color dot */}
        {item.selectedColor && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="w-3.5 h-3.5 rounded-full border border-neutral-200 shadow-sm"
              style={{ backgroundColor: item.selectedColor }}
            />
            <span className="text-[11px] text-neutral-400">{item.selectedColor}</span>
          </div>
        )}

        {/* Price on mobile */}
        <p className="text-sm font-semibold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mt-2 sm:hidden">
          {formatPrice(item.price * item.quantity, i18n.language)}
        </p>

        {/* Quantity & Remove */}
        <div className="flex items-center gap-3 mt-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, item.selectedColor, qty)}
          />
          <IconButton
            icon={Trash2}
            variant="danger"
            size="sm"
            onClick={() => removeItem(item.id, item.selectedColor)}
          />
        </div>
      </div>

      {/* Price on desktop */}
      <div className="hidden sm:flex flex-col items-end justify-center">
        <span className="text-base font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
          {formatPrice(item.price * item.quantity, i18n.language)}
        </span>
        {item.quantity > 1 && (
          <span className="text-xs text-neutral-400 mt-0.5">
            {formatPrice(item.price, i18n.language)} each
          </span>
        )}
      </div>
    </div>
  )
}
