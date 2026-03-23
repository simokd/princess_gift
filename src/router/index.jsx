import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layouts/ClientLayout'
import AdminLayout from '../components/layouts/AdminLayout'
import Home from '../pages/client/Home'
import Products from '../pages/client/Products'
import ProductDetail from '../pages/client/ProductDetail'
import Cart from '../pages/client/Cart'
import Favorites from '../pages/client/Favorites'
import Checkout from '../pages/client/Checkout'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import ProductManagement from '../pages/admin/ProductManagement'
import Categories from '../pages/admin/Categories'
import CarouselManager from '../pages/admin/CarouselManager'
import Orders from '../pages/admin/Orders'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'checkout', element: <Checkout /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductManagement /> },
      { path: 'categories', element: <Categories /> },
      { path: 'carousel', element: <CarouselManager /> },
      { path: 'orders', element: <Orders /> },
    ],
  },
])

export default router
