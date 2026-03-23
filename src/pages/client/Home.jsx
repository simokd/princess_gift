import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Sparkles, Gift, TruckIcon, ShieldCheck } from 'lucide-react'
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
}

const features = [
  { icon: TruckIcon, labelKey: 'home.freeShipping', fallback: 'Free Shipping' },
  { icon: Gift, labelKey: 'home.giftWrapping', fallback: 'Gift Wrapping' },
  { icon: ShieldCheck, labelKey: 'home.securePayment', fallback: 'Secure Payment' },
]

function SectionHeader({ title, action }) {
  return (
    <motion.div
      className="flex items-end justify-between mb-8"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight">
          {title}
        </h2>
      </div>
      {action}
    </motion.div>
  )
}

function ViewAllLink({ to, label }) {
  return (
    <Link
      to={to}
      className={cn(
        'group/link inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium no-underline',
        'bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all duration-200'
      )}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5" />
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

      {/* Feature Badges */}
      <Container className="mt-10">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {features.map(({ icon: Icon, labelKey, fallback }) => (
            <div
              key={labelKey}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 md:p-4 rounded-xl bg-white border border-pink-100/40 shadow-soft text-center sm:text-start"
            >
              <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-pink-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-neutral-600">
                {t(labelKey, fallback)}
              </span>
            </div>
          ))}
        </div>
      </Container>

      {/* Categories */}
      <Container className="mt-14">
        <SectionHeader
          title={t('home.categories')}
          action={<ViewAllLink to="/products" label={t('home.viewAll')} />}
        />

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
                  'group flex flex-col items-center gap-3 p-5 rounded-2xl no-underline',
                  'bg-white border border-pink-100/40',
                  'shadow-soft hover:shadow-md hover:-translate-y-1',
                  'transition-all duration-300'
                )}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-pink-50 ring-2 ring-pink-100/50 transition-all group-hover:ring-pink-200/70 group-hover:scale-105">
                  <img
                    src={cat.image}
                    alt={getCategoryName(cat)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-neutral-600 group-hover:text-pink-600 transition-colors">
                  {getCategoryName(cat)}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Featured Products */}
      <Container className="mt-14 mb-16">
        <SectionHeader
          title={
            <span className="inline-flex items-center gap-2">
              {t('home.featured')}
              <Sparkles className="w-5 h-5 text-pink-400" />
            </span>
          }
          action={<ViewAllLink to="/products" label={t('home.viewAll')} />}
        />

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
