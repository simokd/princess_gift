import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import Container from '../ui/Container'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-pink-100/50 mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-pink-500 mb-3">
              Princess Gifts
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {t('common.brandTagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 mb-3">{t('common.products')}</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <Link to="/products" className="text-sm text-neutral-500 hover:text-pink-500 transition-colors no-underline">
                  {t('home.viewAll')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-neutral-500 hover:text-pink-500 transition-colors no-underline">
                  {t('common.favorites')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-neutral-500 hover:text-pink-500 transition-colors no-underline">
                  {t('common.cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-500 list-none p-0 m-0">
              <li>Casablanca, Morocco</li>
              <li>+212 6XX XXX XXX</li>
              <li>hello@princessgifts.ma</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-4 border-t border-pink-100/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-400">
            &copy; 2026 Princess Gifts. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> in Morocco
          </p>
        </div>
      </Container>
    </footer>
  )
}
