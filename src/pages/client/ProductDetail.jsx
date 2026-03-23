import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart, ChevronLeft, Check, ChevronRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
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

const infoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const infoItemVariants = {
  hidden: { opacity: 0, x: 25 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
}

const trustBadges = [
  { icon: Truck, label: 'Free Shipping', labelKey: 'products.freeShipping' },
  { icon: RotateCcw, label: 'Easy Returns', labelKey: 'products.easyReturns' },
  { icon: ShieldCheck, label: 'Secure Payment', labelKey: 'products.securePayment' },
]

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
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setAdded(false)
      setQuantity(1)
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
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedColor)
    }
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
  const images = product.images || []

  return (
    <PageTransition>
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
        <Link to="/" className="hover:text-pink-500 transition-colors no-underline text-neutral-400">
          {t('common.home')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-pink-500 transition-colors no-underline text-neutral-400">
          {t('common.products')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-600 truncate max-w-[200px]">{getLocalized('title')}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative group/image aspect-square rounded-2xl overflow-hidden bg-pink-50/50 mb-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={getLocalized('title')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
              />
            </AnimatePresence>

            {/* Image nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                  className="absolute start-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white shadow-sm transition-all cursor-pointer opacity-0 group-hover/image:opacity-100 border-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white shadow-sm transition-all cursor-pointer opacity-0 group-hover/image:opacity-100 border-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all cursor-pointer border-none',
                      i === selectedImage ? 'bg-white w-5 shadow-sm' : 'bg-white/50 hover:bg-white/70'
                    )}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                    i === selectedImage
                      ? 'border-pink-400 shadow-md ring-2 ring-pink-200/50'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div
          className="flex flex-col"
          variants={infoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-3" variants={infoItemVariants}>
            <Badge variant={product.inStock ? 'success' : 'error'}>
              {product.inStock ? t('products.inStock') : t('products.outOfStock')}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl mb-2"
            variants={infoItemVariants}
          >
            {getLocalized('title')}
          </motion.h1>

          <motion.p
            className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mb-6"
            variants={infoItemVariants}
          >
            {formatPrice(product.price, i18n.language)}
          </motion.p>

          <motion.p
            className="text-neutral-500 leading-relaxed mb-8"
            variants={infoItemVariants}
          >
            {getLocalized('description')}
          </motion.p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <motion.div className="mb-8" variants={infoItemVariants}>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3 m-0">
                {t('products.availableColors')}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color: ${color}`}
                    className={cn(
                      'w-10 h-10 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center',
                      selectedColor === color
                        ? 'border-pink-400 scale-110 shadow-md ring-2 ring-pink-200/50'
                        : 'border-neutral-200 hover:scale-105 hover:border-neutral-300'
                    )}
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
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div className="mb-8" variants={infoItemVariants}>
            <h3 className="text-sm font-semibold text-neutral-700 mb-3 m-0">
              {t('products.quantity', 'Quantity')}
            </h3>
            <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-4 py-2.5 text-neutral-500 hover:text-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-semibold text-neutral-700 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={quantity >= 10}
                className="px-4 py-2.5 text-neutral-500 hover:text-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
              >
                +
              </button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div className="flex gap-3" variants={infoItemVariants}>
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
            />
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="mt-8 grid grid-cols-3 gap-3"
            variants={infoItemVariants}
          >
            {trustBadges.map(({ icon: Icon, label, labelKey }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-pink-50/50 text-center">
                <Icon className="w-4 h-4 text-pink-400" />
                <span className="text-[11px] font-medium text-neutral-500">
                  {t(labelKey, label)}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-pink-200/60 to-transparent mb-12" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">{t('products.relatedProducts')}</h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {related.map((p) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
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
