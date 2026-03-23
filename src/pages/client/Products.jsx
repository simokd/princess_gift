import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PackageOpen, LayoutGrid, LayoutList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
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
  const [gridCols, setGridCols] = useState(4)

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

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleFr && p.titleFr.toLowerCase().includes(q)) ||
          (p.titleAr && p.titleAr.includes(search))
      )
    }

    if (categoryId) {
      result = result.filter((p) => String(p.categoryId) === String(categoryId))
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice))
    }

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
      <Container className="py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-neutral-800 mb-2">
            {t('products.title')}
          </h1>
          <p className="text-neutral-400 text-sm">
            {t('products.subtitle', 'Discover our curated collection of premium gifts')}
          </p>
        </div>

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

        {/* Toolbar: results count + grid toggle */}
        <div className="mt-6 mb-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span className="font-medium text-neutral-700">{filtered.length}</span>
            {filtered.length === 1 ? 'product' : 'products'}
          </span>

          <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-lg p-0.5">
            <button
              onClick={() => setGridCols(4)}
              className={cn(
                'p-1.5 rounded-md transition-all cursor-pointer',
                gridCols === 4 ? 'bg-white shadow-sm text-pink-500' : 'text-neutral-400 hover:text-neutral-600'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={cn(
                'p-1.5 rounded-md transition-all cursor-pointer',
                gridCols === 3 ? 'bg-white shadow-sm text-pink-500' : 'text-neutral-400 hover:text-neutral-600'
              )}
              aria-label="Large grid view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid or Empty */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={gridKey}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'grid gap-4 md:gap-6',
                gridCols === 3
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              )}
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
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center mb-6">
                <PackageOpen className="w-10 h-10 text-pink-300" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">{t('common.noResults')}</h3>
              <p className="text-sm text-neutral-400 max-w-sm">
                Try adjusting your filters or search term to find what you're looking for
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </PageTransition>
  )
}
