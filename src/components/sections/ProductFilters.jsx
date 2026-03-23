import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'

export default function ProductFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  categories = [],
}) {
  const { t, i18n } = useTranslation()

  const getCategoryName = (cat) => {
    if (i18n.language === 'ar') return cat.nameAr || cat.name
    if (i18n.language === 'fr') return cat.nameFr || cat.name
    return cat.name
  }

  const categoryOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: getCategoryName(cat),
  }))

  const sortOptions = [
    { value: 'newest', label: t('products.sortNewest') },
    { value: 'priceLow', label: t('products.sortPriceLow') },
    { value: 'priceHigh', label: t('products.sortPriceHigh') },
    { value: 'name', label: t('products.sortName') },
  ]

  return (
    <div className="bg-white rounded-xl border border-pink-100/50 shadow-soft p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-pink-400" />
        <h3 className="text-sm font-semibold text-neutral-700 m-0">{t('common.filter')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            placeholder={t('products.searchPlaceholder')}
            icon={Search}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category */}
        <Select
          placeholder={t('common.all')}
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        />

        {/* Min Price */}
        <Input
          type="number"
          placeholder={t('products.minPrice')}
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          min="0"
        />

        {/* Max Price */}
        <Input
          type="number"
          placeholder={t('products.maxPrice')}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          min="0"
        />

        {/* Sort */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        />
      </div>
    </div>
  )
}
