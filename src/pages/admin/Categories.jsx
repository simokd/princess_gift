import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import IconButton from '../../components/ui/IconButton'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import categoryService from '../../services/categoryService'

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.06 } },
}

export default function Categories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState({ name: '', nameFr: '', nameAr: '', image: '' })

  const load = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', nameFr: '', nameAr: '', image: '' })
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({
      name: cat.name || '',
      nameFr: cat.nameFr || '',
      nameAr: cat.nameAr || '',
      image: cat.image || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await categoryService.update(editing.id, form)
      } else {
        await categoryService.create(form)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id)
      setDeleteConfirm(null)
      await load()
    } catch (err) {
      console.error(err)
    }
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
          {t('admin.categoryManagement')}
        </motion.h1>
        <Button icon={Plus} onClick={openAdd}>{t('admin.addCategory')}</Button>
      </div>

      {/* Category Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={fadeIn}
            className="bg-white rounded-xl border border-pink-100/50 p-4 flex items-center gap-4 shadow-card hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-pink-50 shrink-0">
              {cat.image && (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-800 truncate m-0">{cat.name}</p>
              <p className="text-xs text-neutral-400 truncate m-0">
                {cat.nameFr} / {cat.nameAr}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <IconButton
                icon={Pencil}
                variant="default"
                size="sm"
                onClick={() => openEdit(cat)}
                aria-label={t('admin.editCategory')}
              />
              <IconButton
                icon={Trash2}
                variant="danger"
                size="sm"
                onClick={() => setDeleteConfirm(cat)}
                aria-label={t('admin.deleteCategory')}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.editCategory') : t('admin.addCategory')}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={`${t('admin.categoryName')} (EN)`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label={`${t('admin.categoryName')} (FR)`}
            value={form.nameFr}
            onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
          />
          <Input
            label={`${t('admin.categoryName')} (AR)`}
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            dir="rtl"
          />
          <Input
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
          />
          {form.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-pink-50">
              <img src={form.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('admin.deleteCategory')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm?.id)}>{t('common.delete')}</Button>
          </>
        }
      >
        <p className="text-neutral-600">{t('admin.confirmDelete')}</p>
        <p className="font-medium text-neutral-800 mt-2">{deleteConfirm?.name}</p>
      </Modal>
    </div>
  )
}
