import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import IconButton from '../../components/ui/IconButton'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import ProductForm from '../../components/common/ProductForm'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductManagement() {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditing(product)
    setModalOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await productService.update(editing.id, data)
      } else {
        await productService.create(data)
      }
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.delete(id)
      setDeleteConfirm(null)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId)
    return cat?.name || '—'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-neutral-900 m-0"
        >
          {t('admin.productManagement')}
        </motion.h1>
        <Button icon={Plus} onClick={handleAdd}>{t('admin.addProduct')}</Button>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-xl border border-pink-100/50 overflow-hidden shadow-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100/50 bg-pink-50/30">
                <th className="text-start py-3 px-4 text-neutral-500 font-medium">Image</th>
                <th className="text-start py-3 px-4 text-neutral-500 font-medium">{t('admin.productTitle')}</th>
                <th className="text-start py-3 px-4 text-neutral-500 font-medium">{t('admin.productCategory')}</th>
                <th className="text-start py-3 px-4 text-neutral-500 font-medium">{t('admin.productPrice')}</th>
                <th className="text-start py-3 px-4 text-neutral-500 font-medium">Status</th>
                <th className="text-end py-3 px-4 text-neutral-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-50 last:border-b-0 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-pink-50">
                      <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-neutral-800">{product.title}</span>
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{getCategoryName(product.categoryId)}</td>
                  <td className="py-3 px-4 font-medium text-neutral-800">
                    {formatPrice(product.price, i18n.language)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={product.inStock ? 'success' : 'error'} size="sm">
                      {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={Pencil}
                        variant="default"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        aria-label={t('admin.editProduct')}
                      />
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirm(product)}
                        aria-label={t('admin.deleteProduct')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? t('admin.editProduct') : t('admin.addProduct')}
        size="lg"
      >
        <ProductForm
          product={editing}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('admin.deleteProduct')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm?.id)}>{t('common.delete')}</Button>
          </>
        }
      >
        <p className="text-neutral-600">{t('admin.confirmDelete')}</p>
        <p className="font-medium text-neutral-800 mt-2">{deleteConfirm?.title}</p>
      </Modal>
    </div>
  )
}
