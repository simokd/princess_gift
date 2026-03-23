import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../ui/Toast'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToast } = useToast()
  const [imageLoaded, setImageLoaded] = useState(false)

  const liked = isFavorite(product.id)

  const title =
    i18n.language === 'ar'
      ? product.titleAr || product.title
      : i18n.language === 'fr'
        ? product.titleFr || product.title
        : product.title

  return (
    <div className="group relative bg-white rounded-2xl border border-pink-100/40 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-square bg-pink-50/50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-pink-50 animate-pulse" />
        )}
        <img
          src={product.images?.[0]}
          alt={title}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 bg-neutral-800 text-white text-xs font-medium rounded-full">
              {t('products.outOfStock')}
            </span>
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center justify-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-neutral-600 hover:text-pink-500 hover:bg-white transition-all shadow-sm"
              aria-label={t('products.viewDetails') || 'View details'}
            >
              <Eye className="w-4 h-4" />
            </Link>
            {product.inStock && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  addItem(product, product.colors?.[0])
                  addToast(t('products.addedToCart'), 'success')
                }}
                className="p-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-all shadow-sm cursor-pointer"
                aria-label={t('products.addToCart')}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={() => {
          toggleFavorite(product.id)
          const msg = liked
            ? t('favorites.removedFromFavorites')
            : t('favorites.addedToFavorites')
          addToast(msg, 'favorite')
        }}
        className={cn(
          'absolute top-3 end-3 p-2 rounded-xl shadow-sm transition-all cursor-pointer border-none',
          liked
            ? 'bg-pink-500 text-white hover:bg-pink-600'
            : 'bg-white/90 backdrop-blur-sm text-neutral-400 hover:text-pink-500 hover:bg-white'
        )}
        aria-label="Toggle favorite"
      >
        <Heart
          className={cn(
            'w-4 h-4 transition-colors',
            liked && 'fill-current'
          )}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="no-underline">
          <h3 className="text-sm font-medium text-neutral-800 mb-1.5 truncate hover:text-pink-500 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-neutral-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-neutral-400 font-medium">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            {formatPrice(product.price, i18n.language)}
          </span>
        </div>
      </div>
    </div>
  )
}
