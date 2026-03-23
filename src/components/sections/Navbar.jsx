import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Heart, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import Container from '../ui/Container'

export default function Navbar() {
  const { t } = useTranslation()
  const { itemCount } = useCart()
  const { favoriteCount } = useFavorites()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/', label: t('common.home') },
    { to: '/products', label: t('common.products') },
  ]

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-pink-500'
        : 'text-neutral-600 hover:text-pink-500'
    }`

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100/50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-bold font-[family-name:var(--font-heading)] text-pink-500">
              Princess Gifts
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />

            <Link
              to="/favorites"
              className="relative p-2 rounded-full text-neutral-500 hover:text-pink-500 hover:bg-pink-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4.5 h-4.5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-full text-neutral-500 hover:text-pink-500 hover:bg-pink-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4.5 h-4.5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full text-neutral-500 hover:text-pink-500 hover:bg-pink-50 transition-colors cursor-pointer ms-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-pink-100/50 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-pink-50 text-pink-500'
                      : 'text-neutral-600 hover:bg-pink-50 hover:text-pink-500'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </Container>
    </nav>
  )
}
