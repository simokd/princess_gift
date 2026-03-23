import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import HeroCarousel from '../../components/sections/HeroCarousel'
import ProductCard from '../../components/common/ProductCard'
import Spinner from '../../components/ui/Spinner'
import carouselService from '../../services/carouselService'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

const sectionHeadingVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

function ViewAllLink({ to, label }) {
  return (
    <Link
      to={to}
      className={cn(
        'group/link flex items-center gap-1 text-sm font-medium no-underline',
        'text-pink-500 hover:text-pink-600 transition-colors'
      )}
    >
      {label}
      <ArrowRight
        className={cn(
          'w-4 h-4 transition-transform duration-300',
          'group-hover/link:translate-x-1'
        )}
      />
    </Link>
  )
}

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
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={sectionHeadingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
            {t('home.categories')}
          </h2>
          <ViewAllLink to="/products" label={t('home.viewAll')} />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                to={`/products?category=${cat.id}`}
                className={cn(
                  'group flex flex-col items-center gap-3 p-4 rounded-xl no-underline',
                  'bg-white border border-pink-100/50',
                  'shadow-soft hover:shadow-card hover:-translate-y-1',
                  'transition-all duration-300'
                )}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-50 ring-2 ring-pink-100/40">
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
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Decorative gradient divider */}
      <Container className="mt-16">
        <div
          className={cn(
            'h-px w-full rounded-full',
            'bg-gradient-to-r from-transparent via-pink-300/50 to-transparent'
          )}
          aria-hidden="true"
        />
      </Container>

      {/* Featured Products */}
      <Container className="mt-16 mb-16">
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={sectionHeadingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
            {t('home.featured')}
          </h2>
          <ViewAllLink to="/products" label={t('home.viewAll')} />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </PageTransition>
  )
}
