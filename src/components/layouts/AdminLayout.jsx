import { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from '../sections/AdminSidebar'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-neutral-100 flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer me-3"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-neutral-500">
            Princess Gifts — Admin Panel
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
