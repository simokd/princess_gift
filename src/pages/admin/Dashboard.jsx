import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../../components/common/KPICard'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import productService from '../../services/productService'
import orderService from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'

const PIE_COLORS = ['#F472B6', '#EC4899', '#F9A8D4', '#FBCFE8', '#A78BFA', '#FDE68A']

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, productsData] = await Promise.all([
          orderService.getAll(),
          productService.getAll(),
        ])
        setOrders(ordersData)
        setProducts(productsData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length

  // Top products by order frequency
  const productCounts = {}
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      productCounts[item.title] = (productCounts[item.title] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // Sales by status for pie chart
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // Monthly sales chart (mock based on order dates)
  const monthlySales = orders.reduce((acc, o) => {
    const month = o.createdAt?.substring(0, 7) || 'Unknown'
    acc[month] = (acc[month] || 0) + o.total
    return acc
  }, {})
  const salesChartData = Object.entries(monthlySales)
    .sort()
    .map(([month, sales]) => ({
      month: month.substring(5),
      sales,
    }))

  const statusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'confirmed': return 'pink'
      case 'pending': return 'gold'
      default: return 'neutral'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('admin.dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          icon={DollarSign}
          label={t('admin.totalSales')}
          value={formatPrice(totalSales, i18n.language)}
          trend={12}
          color="green"
        />
        <KPICard
          icon={ShoppingBag}
          label={t('admin.totalOrders')}
          value={totalOrders}
          trend={8}
          color="blue"
        />
        <KPICard
          icon={Package}
          label={t('admin.totalProducts')}
          value={totalProducts}
          color="amber"
        />
        <KPICard
          icon={TrendingUp}
          label={t('admin.topProducts')}
          value={topProducts[0]?.name || '—'}
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 p-5">
          <h3 className="text-sm font-semibold text-neutral-700 mb-4 m-0">{t('admin.salesChart')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#D4D4D4" />
              <YAxis tick={{ fontSize: 12 }} stroke="#D4D4D4" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #FCE7F3',
                  boxShadow: '0 4px 6px rgba(244,114,182,0.1)',
                }}
              />
              <Bar dataKey="sales" fill="#F472B6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-xl border border-neutral-100 p-5">
          <h3 className="text-sm font-semibold text-neutral-700 mb-4 m-0">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={4}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-neutral-600 capitalize">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-neutral-100 p-5">
        <h3 className="text-sm font-semibold text-neutral-700 mb-4 m-0">{t('admin.recentOrders')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">#</th>
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">Customer</th>
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">Items</th>
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">Total</th>
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">{t('admin.orderStatus')}</th>
                <th className="text-start py-3 px-2 text-neutral-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice().reverse().map((order) => (
                <tr key={order.id} className="border-b border-neutral-50 last:border-b-0">
                  <td className="py-3 px-2 font-medium text-neutral-800">{order.id}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </td>
                  <td className="py-3 px-2 text-neutral-500">
                    {order.items?.length || 0} items
                  </td>
                  <td className="py-3 px-2 font-medium text-neutral-800">
                    {formatPrice(order.total, i18n.language)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={statusBadgeVariant(order.status)} size="sm">
                      {t(`admin.order${order.status?.charAt(0).toUpperCase()}${order.status?.slice(1)}`)}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-neutral-500">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
