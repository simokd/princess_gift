import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Crown, Instagram, Facebook, Twitter } from 'lucide-react'
import Container from '../ui/Container'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-pink-100/40 mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent m-0">
                Princess Gifts
              </h3>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              {t('common.brandTagline')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-400 hover:bg-pink-100 hover:text-pink-600 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 mb-4">{t('common.products')}</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                { to: '/products', label: t('home.viewAll') },
                { to: '/favorites', label: t('common.favorites') },
                { to: '/cart', label: t('common.cart') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-pink-500 transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 list-none p-0 m-0">
              <li>Casablanca, Morocco</li>
              <li>+212 6XX XXX XXX</li>
              <li>hello@princessgifts.ma</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 mb-4">
              {t('footer.newsletter', 'Newsletter')}
            </h4>
            <p className="text-sm text-neutral-400 mb-3">
              {t('footer.newsletterDesc', 'Get notified about new arrivals and exclusive offers.')}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder', 'Your email')}
                className="flex-1 min-w-0 px-3.5 py-2 text-sm rounded-xl bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all placeholder:text-neutral-300"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-pointer border-none shadow-sm"
              >
                {t('footer.subscribe', 'Join')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-4 border-t border-pink-100/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-300">
            &copy; 2026 Princess Gifts. All rights reserved.
          </p>
          <p className="text-xs text-neutral-300 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> in Morocco
          </p>
        </div>
      </Container>
    </footer>
  )
}
