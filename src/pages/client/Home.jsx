import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import HeroCarousel from '../../components/sections/HeroCarousel'
import ProductCard from '../../components/common/ProductCard'
import Spinner from '../../components/ui/Spinner'
import carouselService from '../../services/carouselService'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [slides, setSlides] = useState([])
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [slidesData, productsData, categoriesData] = await Promise.all([
          carouselService.getActive(),
          productService.getFeatured(),
          categoryService.getAll(),
        ])
        setSlides(slidesData)
        setFeatured(productsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getCategoryName = (cat) => {
    if (i18n.language === 'ar') return cat.nameAr || cat.name
    if (i18n.language === 'fr') return cat.nameFr || cat.name
    return cat.name
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <PageTransition>
      {/* Hero Carousel */}
      <Container className="mt-6">
        <HeroCarousel slides={slides} />
      </Container>

      {/* Categories */}
      <Container className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl">{t('home.categories')}</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors no-underline"
          >
            {t('home.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-pink-100/50 shadow-soft hover:shadow-card transition-all no-underline"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-50">
                <img
                  src={cat.image}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-pink-500 transition-colors">
                {getCategoryName(cat)}
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Featured Products */}
      <Container className="mt-16 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl">{t('home.featured')}</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors no-underline"
          >
            {t('home.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </PageTransition>
  )
}
