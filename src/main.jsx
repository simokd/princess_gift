import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ToastProvider } from './components/ui/Toast'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </FavoritesProvider>
      </CartProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
