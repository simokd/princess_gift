import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/common/ProductCard'
import { useFavorites } from '../../context/FavoritesContext'
import productService from '../../services/productService'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
}

export default function Favorites() {
  const { t } = useTranslation()
  const { favorites } = useFavorites()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const all = await productService.getAll()
        setProducts(all.filter((p) => favorites.includes(p.id)))
      } catch (err) {
        console.error('Failed to load favorites:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [favorites])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center justify-center text-center max-w-sm mx-auto"
        >
          <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-pink-300" />
          </div>
          <h2 className="text-2xl mb-2">{t('favorites.empty')}</h2>
          <p className="text-neutral-400 mb-6 text-sm">{t('favorites.emptyMessage')}</p>
          <Link to="/products">
            <Button>{t('cart.continueShopping')}</Button>
          </Link>
        </motion.div>
      </Container>
    )
  }

  return (
    <PageTransition>
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl"
        >
          {t('favorites.title')}
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-sm font-medium"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          {products.length}
        </motion.span>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={fadeIn}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </Container>
    </PageTransition>
  )
}
