import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroCarousel({ slides = [] }) {
  const { t, i18n } = useTranslation()
  const [current, setCurrent] = useState(0)
  const isRTL = i18n.language === 'ar'

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (!slides.length) return null

  const getLocalizedField = (slide, field) => {
    if (i18n.language === 'ar') return slide[`${field}Ar`] || slide[field]
    if (i18n.language === 'fr') return slide[`${field}Fr`] || slide[field]
    return slide[field]
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-pink-50" style={{ height: 'clamp(280px, 45vw, 480px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-end pb-12 px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg max-w-2xl">
              {getLocalizedField(slides[current], 'title')}
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-6 max-w-lg drop-shadow">
              {getLocalizedField(slides[current], 'subtitle')}
            </p>
            <Link
              to={slides[current].link || '/products'}
              className="inline-flex items-center px-6 py-2.5 bg-white text-pink-500 font-medium text-sm rounded-full hover:bg-pink-50 transition-colors shadow-lg no-underline"
            >
              {t('home.shopNow')}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={isRTL ? next : prev}
            className="absolute start-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-neutral-700 hover:bg-white transition-colors shadow-md cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={isRTL ? prev : next}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-neutral-700 hover:bg-white transition-colors shadow-md cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
