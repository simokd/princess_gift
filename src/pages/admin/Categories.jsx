import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import categoryService from '../../services/categoryService'

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
        <h1 className="text-2xl font-bold text-neutral-900 m-0">{t('admin.categoryManagement')}</h1>
        <Button icon={Plus} onClick={openAdd}>{t('admin.addCategory')}</Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center gap-4"
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
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer bg-transparent border-none"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirm(cat)}
                className="p-2 rounded-lg text-neutral-400 hover:text-error hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
