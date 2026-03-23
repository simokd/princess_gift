import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/common/ProductCard'
import { useFavorites } from '../../context/FavoritesContext'
import productService from '../../services/productService'

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
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-pink-300" />
          </div>
          <h2 className="text-2xl mb-2">{t('favorites.empty')}</h2>
          <p className="text-neutral-500 mb-6">{t('favorites.emptyMessage')}</p>
          <Link to="/products">
            <Button>{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <PageTransition>
    <Container className="py-8">
      <h1 className="text-3xl mb-8">{t('favorites.title')}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
    </PageTransition>
  )
}
