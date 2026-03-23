import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

export default function ProductForm({ product, categories = [], onSubmit, onCancel }) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    title: '',
    titleAr: '',
    titleFr: '',
    description: '',
    descriptionAr: '',
    descriptionFr: '',
    price: '',
    categoryId: '',
    colors: [],
    images: [],
    inStock: true,
    featured: false,
  })

  const [newColor, setNewColor] = useState('#F472B6')
  const [newImage, setNewImage] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        titleAr: product.titleAr || '',
        titleFr: product.titleFr || '',
        description: product.description || '',
        descriptionAr: product.descriptionAr || '',
        descriptionFr: product.descriptionFr || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        colors: product.colors || [],
        images: product.images || [],
        inStock: product.inStock ?? true,
        featured: product.featured ?? false,
      })
    }
  }, [product])

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addColor = () => {
    if (newColor && !form.colors.includes(newColor)) {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, newColor] }))
    }
  }

  const removeColor = (color) => {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setForm((prev) => ({ ...prev, images: [...prev.images, newImage.trim()] }))
      setNewImage('')
    }
  }

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    })
  }

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Titles */}
      <Input
        label={`${t('admin.productTitle')} (EN)`}
        value={form.title}
        onChange={handleChange('title')}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('admin.productTitle')} (FR)`}
          value={form.titleFr}
          onChange={handleChange('titleFr')}
        />
        <Input
          label={`${t('admin.productTitle')} (AR)`}
          value={form.titleAr}
          onChange={handleChange('titleAr')}
          dir="rtl"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {t('admin.productDescription')} (EN)
        </label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-white border border-neutral-200 focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none resize-none"
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('admin.productPrice')}
          type="number"
          value={form.price}
          onChange={handleChange('price')}
          min="0"
          required
        />
        <Select
          label={t('admin.productCategory')}
          options={categoryOptions}
          value={String(form.categoryId)}
          onChange={handleChange('categoryId')}
          placeholder="Select..."
        />
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {t('admin.productColors')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-xs"
            >
              <span className="w-4 h-4 rounded-full border border-neutral-200" style={{ backgroundColor: color }} />
              {color}
              <button type="button" onClick={() => removeColor(color)} className="text-neutral-400 hover:text-error cursor-pointer bg-transparent border-none p-0">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-1"
          />
          <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addColor}>
            Add Color
          </Button>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {t('admin.productImages')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 end-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow cursor-pointer border-none p-0"
              >
                <X className="w-3 h-3 text-error" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Image URL..."
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="md" icon={Plus} onClick={addImage}>
            Add
          </Button>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={handleChange('inStock')}
            className="accent-pink-500"
          />
          {t('products.inStock')}
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={handleChange('featured')}
            className="accent-pink-500"
          />
          Featured
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit">{t('common.save')}</Button>
      </div>
    </form>
  )
}
