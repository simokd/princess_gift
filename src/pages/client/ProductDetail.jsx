import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart, ChevronLeft, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/common/ProductCard'
import { useToast } from '../../components/ui/Toast'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import productService from '../../services/productService'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToast } = useToast()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setAdded(false)
      try {
        const prod = await productService.getById(id)
        setProduct(prod)
        setSelectedColor(prod.colors?.[0] || null)
        setSelectedImage(0)

        const allProducts = await productService.getByCategory(prod.categoryId)
        setRelated(allProducts.filter((p) => p.id !== prod.id).slice(0, 4))
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const getLocalized = (field) => {
    if (!product) return ''
    if (i18n.language === 'ar') return product[`${field}Ar`] || product[field]
    if (i18n.language === 'fr') return product[`${field}Fr`] || product[field]
    return product[field]
  }

  const handleAddToCart = () => {
    addItem(product, selectedColor)
    setAdded(true)
    addToast(t('products.addedToCart'), 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product.id)
    const msg = isFavorite(product.id)
      ? t('favorites.removedFromFavorites')
      : t('favorites.addedToFavorites')
    addToast(msg, 'favorite')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <p className="text-neutral-500">Product not found</p>
      </Container>
    )
  }

  const liked = isFavorite(product.id)

  return (
    <PageTransition>
    <Container className="py-8">
      {/* Back */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-pink-500 transition-colors mb-6 no-underline"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-square rounded-2xl overflow-hidden bg-pink-50 mb-4"
          >
            <img
              src={product.images?.[selectedImage]}
              alt={getLocalized('title')}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === selectedImage
                      ? 'border-pink-400 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Badge variant={product.inStock ? 'success' : 'error'}>
              {product.inStock ? t('products.inStock') : t('products.outOfStock')}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl mb-3">{getLocalized('title')}</h1>

          <p className="text-3xl font-bold text-pink-500 mb-6">
            {formatPrice(product.price, i18n.language)}
          </p>

          <p className="text-neutral-600 leading-relaxed mb-8">
            {getLocalized('description')}
          </p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3 m-0">
                {t('products.availableColors')}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor === color
                        ? 'border-pink-400 scale-110 shadow-md'
                        : 'border-neutral-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check
                        className="w-4 h-4"
                        style={{
                          color: isLightColor(color) ? '#171717' : '#FFFFFF',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <Button
              size="lg"
              icon={added ? Check : ShoppingCart}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1"
            >
              {added ? t('products.addedToCart') : t('products.addToCart')}
            </Button>
            <Button
              variant={liked ? 'secondary' : 'outline'}
              size="lg"
              icon={Heart}
              onClick={handleToggleFavorite}
            >
              {liked ? '' : ''}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl mb-6">{t('products.relatedProducts')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </Container>
    </PageTransition>
  )
}

function isLightColor(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}
