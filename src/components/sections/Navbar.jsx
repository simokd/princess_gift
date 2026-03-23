import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Heart, Menu, X, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import Container from '../ui/Container'

export default function Navbar() {
  const { t } = useTranslation()
  const { itemCount } = useCart()
  const { favoriteCount } = useFavorites()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Detect scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/', label: t('common.home') },
    { to: '/products', label: t('common.products') },
  ]

  return (
    <nav
      className={`sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b transition-shadow duration-300 ${
        scrolled ? 'border-pink-100/60 shadow-md' : 'border-pink-100/30 shadow-none'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Crown className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-heading)] bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Princess Gifts
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-neutral-500 hover:text-pink-500 hover:bg-pink-50/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <LanguageSwitcher />

            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 end-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {favoriteCount}
                </motion.span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 end-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all cursor-pointer ms-0.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="border-t border-pink-100/50 py-3 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-pink-50 text-pink-600'
                          : 'text-neutral-500 hover:bg-pink-50/50 hover:text-pink-500'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </nav>
  )
}
