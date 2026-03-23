import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from '../../components/ui/Badge'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'
import orderService from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'

export default function Orders() {
  const { t, i18n } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await orderService.getAll()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const statusVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'confirmed': return 'pink'
      case 'pending': return 'gold'
      default: return 'neutral'
    }
  }

  const statusOptions = [
    { value: 'pending', label: t('admin.orderPending') },
    { value: 'confirmed', label: t('admin.orderConfirmed') },
    { value: 'delivered', label: t('admin.orderDelivered') },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('admin.orders')}</h1>

      <div className="space-y-4">
        {orders.slice().reverse().map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-neutral-100 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-neutral-800 m-0">
                    Order #{order.id}
                  </h3>
                  <Badge variant={statusVariant(order.status)} size="sm">
                    {t(`admin.order${order.status?.charAt(0).toUpperCase()}${order.status?.slice(1)}`)}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-1 m-0">
                  {order.createdAt} — {order.customer?.firstName} {order.customer?.lastName}
                </p>
              </div>
              <div className="w-40">
                <Select
                  options={statusOptions}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2">
                    {item.color && (
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-200"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <span className="text-neutral-700">{item.title}</span>
                    <span className="text-neutral-400">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-neutral-700">
                    {formatPrice(item.price * item.quantity, i18n.language)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div className="text-xs text-neutral-500">
                <span>{order.customer?.phone}</span>
                <span className="mx-2">|</span>
                <span>{order.customer?.city}</span>
              </div>
              <span className="text-lg font-bold text-pink-500">
                {formatPrice(order.total, i18n.language)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
