import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PackageOpen } from 'lucide-react'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/common/ProductCard'
import ProductFilters from '../../components/sections/ProductFilters'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'

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
      <h1 className="text-3xl md:text-4xl text-center mb-8">{t('products.title')}</h1>

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

      {/* Results count */}
      <p className="text-sm text-neutral-500 mt-6 mb-4">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
      </p>

      {/* Grid or Empty */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageOpen className="w-16 h-16 text-pink-200 mb-4" />
          <h3 className="text-lg font-medium text-neutral-700 mb-2">{t('common.noResults')}</h3>
          <p className="text-sm text-neutral-400">Try adjusting your filters</p>
        </div>
      )}
    </Container>
    </PageTransition>
  )
}
