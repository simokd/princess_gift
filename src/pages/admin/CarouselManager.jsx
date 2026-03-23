import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import IconButton from '../../components/ui/IconButton'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { cn } from '../../utils/cn'
import carouselService from '../../services/carouselService'

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
}

export default function CarouselManager() {
  const { t } = useTranslation()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState({
    title: '', titleFr: '', titleAr: '',
    subtitle: '', subtitleFr: '', subtitleAr: '',
    image: '', link: '/products', active: true,
  })

  const load = async () => {
    try {
      const data = await carouselService.getAll()
      setSlides(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({
      title: '', titleFr: '', titleAr: '',
      subtitle: '', subtitleFr: '', subtitleAr: '',
      image: '', link: '/products', active: true,
    })
    setModalOpen(true)
  }

  const openEdit = (slide) => {
    setEditing(slide)
    setForm({
      title: slide.title || '',
      titleFr: slide.titleFr || '',
      titleAr: slide.titleAr || '',
      subtitle: slide.subtitle || '',
      subtitleFr: slide.subtitleFr || '',
      subtitleAr: slide.subtitleAr || '',
      image: slide.image || '',
      link: slide.link || '/products',
      active: slide.active ?? true,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await carouselService.update(editing.id, form)
      } else {
        await carouselService.create(form)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleActive = async (slide) => {
    try {
      await carouselService.update(slide.id, { ...slide, active: !slide.active })
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await carouselService.delete(id)
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
          {t('admin.carouselManagement')}
        </motion.h1>
        <Button icon={Plus} onClick={openAdd}>{t('admin.addSlide')}</Button>
      </div>

      {/* Slides */}
      <motion.div
        className="space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {slides.map((slide) => (
          <motion.div
            key={slide.id}
            variants={fadeIn}
            className={cn(
              'bg-white rounded-xl border overflow-hidden flex flex-col sm:flex-row shadow-card hover:shadow-lg transition-all duration-300',
              slide.active ? 'border-pink-100/50' : 'border-neutral-200 opacity-60'
            )}
          >
            {/* Preview */}
            <div className="sm:w-64 h-36 sm:h-auto shrink-0 bg-pink-50 overflow-hidden">
              {slide.image && (
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-neutral-800 mb-1 m-0">{slide.title}</h3>
                <p className="text-sm text-neutral-500 m-0">{slide.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => toggleActive(slide)}
                  className={cn(
                    'p-2 rounded-lg transition-colors cursor-pointer bg-transparent border-none',
                    slide.active
                      ? 'text-success hover:bg-emerald-50'
                      : 'text-neutral-400 hover:bg-neutral-100'
                  )}
                  aria-label={slide.active ? 'Deactivate slide' : 'Activate slide'}
                >
                  {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <IconButton
                  icon={Pencil}
                  variant="default"
                  size="sm"
                  onClick={() => openEdit(slide)}
                  aria-label={t('admin.addSlide')}
                />
                <IconButton
                  icon={Trash2}
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirm(slide)}
                  aria-label="Delete slide"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.addSlide') : t('admin.addSlide')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={`${t('admin.slideTitle')} (EN)`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`${t('admin.slideTitle')} (FR)`}
              value={form.titleFr}
              onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
            />
            <Input
              label={`${t('admin.slideTitle')} (AR)`}
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              dir="rtl"
            />
          </div>
          <Input
            label={`${t('admin.slideSubtitle')} (EN)`}
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`${t('admin.slideSubtitle')} (FR)`}
              value={form.subtitleFr}
              onChange={(e) => setForm({ ...form, subtitleFr: e.target.value })}
            />
            <Input
              label={`${t('admin.slideSubtitle')} (AR)`}
              value={form.subtitleAr}
              onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
              dir="rtl"
            />
          </div>
          <Input
            label={t('admin.slideImage')}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
            required
          />
          {form.image && (
            <div className="w-full h-32 rounded-lg overflow-hidden bg-pink-50">
              <img src={form.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            label="Link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-pink-500"
            />
            Active
          </label>
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
        title="Delete Slide"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm?.id)}>{t('common.delete')}</Button>
          </>
        }
      >
        <p className="text-neutral-600">{t('admin.confirmDelete')}</p>
      </Modal>
    </div>
  )
}
