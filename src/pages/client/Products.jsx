import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PackageOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/common/ProductCard'
import ProductFilters from '../../components/sections/ProductFilters'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
}

const emptyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
}

export default function Products() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Update category when URL param changes
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategoryId(cat)
  }, [searchParams])

  const getTitle = (p) => {
    if (i18n.language === 'ar') return p.titleAr || p.title
    if (i18n.language === 'fr') return p.titleFr || p.title
    return p.title
  }

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleFr && p.titleFr.toLowerCase().includes(q)) ||
          (p.titleAr && p.titleAr.includes(search))
      )
    }

    // Category
    if (categoryId) {
      result = result.filter((p) => String(p.categoryId) === String(categoryId))
    }

    // Price range
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice))
    }

    // Sort
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price)
        break
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => getTitle(a).localeCompare(getTitle(b)))
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [products, search, categoryId, minPrice, maxPrice, sortBy, i18n.language])

  // Key for AnimatePresence based on filter state to re-trigger stagger
  const gridKey = useMemo(
    () => `${search}-${categoryId}-${minPrice}-${maxPrice}-${sortBy}-${filtered.length}`,
    [search, categoryId, minPrice, maxPrice, sortBy, filtered.length]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <PageTransition>
      {/* Decorative pink gradient header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -top-24 bg-gradient-to-b from-pink-100/60 via-pink-50/30 to-transparent pointer-events-none h-72" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative py-8">
          <h1 className="text-3xl md:text-4xl text-center mb-8 text-neutral-800">
            {t('products.title')}
          </h1>

          {/* Filters */}
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={categories}
          />

          {/* Results count pill */}
          <div className="mt-6 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-pink-50 text-pink-600 border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {/* Grid or Empty */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={gridKey}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    custom={index}
                    variants={cardVariants}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                variants={emptyVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-6">
                  <PackageOpen className="w-10 h-10 text-pink-300" />
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-2">{t('common.noResults')}</h3>
                <p className="text-sm text-neutral-400">Try adjusting your filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </PageTransition>
  )
}
