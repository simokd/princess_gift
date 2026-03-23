import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../ui/Toast'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToast } = useToast()

  const liked = isFavorite(product.id)

  const title =
    i18n.language === 'ar'
      ? product.titleAr || product.title
      : i18n.language === 'fr'
        ? product.titleFr || product.title
        : product.title

  return (
    <div className="group relative bg-white rounded-xl border border-pink-100/50 shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.images?.[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-medium rounded-full">
              {t('products.outOfStock')}
            </span>
          </div>
        )}
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
        className="absolute top-3 end-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all cursor-pointer"
        aria-label="Toggle favorite"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            liked ? 'text-pink-500 fill-pink-500' : 'text-neutral-400'
          }`}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="no-underline">
          <h3 className="text-sm font-medium text-neutral-800 mb-1 truncate hover:text-pink-500 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Colors */}
        <div className="flex items-center gap-1 mb-3">
          {product.colors?.slice(0, 4).map((color, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-neutral-200"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors?.length > 4 && (
            <span className="text-xs text-neutral-400">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-pink-500">
            {formatPrice(product.price, i18n.language)}
          </span>
          {product.inStock && (
            <button
              onClick={() => {
                addItem(product, product.colors?.[0])
                addToast(t('products.addedToCart'), 'success')
              }}
              className="p-2 rounded-full text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label={t('products.addToCart')}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
