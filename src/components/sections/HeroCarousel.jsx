import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroCarousel({ slides = [] }) {
  const { t, i18n } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const isRTL = i18n.language === 'ar'
  const INTERVAL = 6000

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [slides.length])

  // Auto-advance with progress bar
  useEffect(() => {
    if (slides.length <= 1) return
    const step = 50
    const increment = (step / INTERVAL) * 100
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next()
          return 0
        }
        return p + increment
      })
    }, step)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (!slides.length) return null

  const getLocalizedField = (slide, field) => {
    if (i18n.language === 'ar') return slide[`${field}Ar`] || slide[field]
    if (i18n.language === 'fr') return slide[`${field}Fr`] || slide[field]
    return slide[field]
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-pink-50 shadow-lg" style={{ height: 'clamp(300px, 48vw, 500px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-end pb-14 px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg max-w-2xl leading-tight"
            >
              {getLocalizedField(slides[current], 'title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm sm:text-base text-white/90 mb-6 max-w-lg drop-shadow"
            >
              {getLocalizedField(slides[current], 'subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Link
                to={slides[current].link || '/products'}
                className="group/btn inline-flex items-center gap-2 px-7 py-3 bg-white text-pink-600 font-semibold text-sm rounded-full hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl no-underline"
              >
                {t('home.shopNow')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={isRTL ? next : prev}
            className="absolute start-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all shadow-md cursor-pointer border-none"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={isRTL ? prev : next}
            className="absolute end-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all shadow-md cursor-pointer border-none"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots + Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setProgress(0) }}
              className="relative h-1.5 rounded-full transition-all cursor-pointer bg-white/30 border-none overflow-hidden"
              style={{ width: i === current ? 32 : 8 }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-y-0 start-0 bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
