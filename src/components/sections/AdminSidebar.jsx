import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Package,
  Tags,
  Images,
  ShoppingBag,
  LogOut,
  X,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, key: 'dashboard', end: true },
  { to: '/admin/products', icon: Package, key: 'productManagement' },
  { to: '/admin/categories', icon: Tags, key: 'categoryManagement' },
  { to: '/admin/carousel', icon: Images, key: 'carouselManagement' },
  { to: '/admin/orders', icon: ShoppingBag, key: 'orders' },
]

export default function AdminSidebar({ open, onClose }) {
  const { t } = useTranslation()
  const { logout } = useAdminAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-pink-50 text-pink-600'
        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
    }`

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 start-0 z-50 h-full w-64 bg-white border-e border-neutral-100
          flex flex-col transition-transform duration-300
          lg:static lg:!translate-x-0
          ${open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-100">
          <span className="text-lg font-bold font-[family-name:var(--font-heading)] text-pink-500">
            Admin
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={onClose}
            >
              <item.icon className="w-5 h-5" />
              {t(`admin.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-neutral-100">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors mb-1"
            onClick={onClose}
          >
            <Package className="w-5 h-5" />
            {t('common.home')}
          </NavLink>
          <button
            onClick={() => { logout(); onClose() }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-neutral-500 hover:bg-red-50 hover:text-error transition-colors cursor-pointer bg-transparent border-none text-start"
          >
            <LogOut className="w-5 h-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>
    </>
  )
}
