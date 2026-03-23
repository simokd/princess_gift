import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useCart } from '../../context/CartContext'
import orderService from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

export default function Checkout() {
  const { t, i18n } = useTranslation()
  const { items, total, clearCart } = useCart()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = t('checkout.required')
    if (!form.lastName.trim()) newErrors.lastName = t('checkout.required')
    if (!form.phone.trim()) newErrors.phone = t('checkout.required')
    else if (!/^[0-9+\s-]{8,15}$/.test(form.phone.trim()))
      newErrors.phone = t('checkout.invalidPhone')
    if (!form.address.trim()) newErrors.address = t('checkout.required')
    if (!form.city.trim()) newErrors.city = t('checkout.required')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const order = await orderService.create({
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          color: item.selectedColor,
        })),
        total,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
        },
        notes: form.notes,
      })
      setOrderNumber(order.id)
      setSuccess(true)
      clearCart()
    } catch (err) {
      console.error('Failed to place order:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
  if (success) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </motion.div>
          <h2 className="text-2xl mb-2">{t('checkout.orderSuccess')}</h2>
          <p className="text-neutral-500 mb-2">{t('checkout.orderSuccessMessage')}</p>
          <p className="text-sm font-medium text-pink-500 mb-8">
            {t('checkout.orderNumber', { number: orderNumber })}
          </p>
          <Link to="/">
            <Button>{t('checkout.backToHome')}</Button>
          </Link>
        </motion.div>
      </Container>
    )
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <p className="text-neutral-500 mb-4">{t('cart.empty')}</p>
        <Link to="/products">
          <Button>{t('cart.continueShopping')}</Button>
        </Link>
      </Container>
    )
  }

  return (
    <PageTransition>
    <Container className="py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl mb-8"
      >
        {t('checkout.title')}
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Personal Info */}
            <motion.div variants={sectionFade}>
              <Card>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 m-0">
                  {t('checkout.personalInfo')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.firstName')}
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                    error={errors.firstName}
                  />
                  <Input
                    label={t('checkout.lastName')}
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                    error={errors.lastName}
                  />
                  <Input
                    label={t('checkout.phone')}
                    value={form.phone}
                    onChange={handleChange('phone')}
                    error={errors.phone}
                    type="tel"
                  />
                  <Input
                    label={t('checkout.email')}
                    value={form.email}
                    onChange={handleChange('email')}
                    type="email"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Shipping */}
            <motion.div variants={sectionFade}>
              <Card>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 m-0">
                  {t('checkout.shippingAddress')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label={t('checkout.address')}
                      value={form.address}
                      onChange={handleChange('address')}
                      error={errors.address}
                    />
                  </div>
                  <Input
                    label={t('checkout.city')}
                    value={form.city}
                    onChange={handleChange('city')}
                    error={errors.city}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('checkout.notes')}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={handleChange('notes')}
                    placeholder={t('checkout.notesPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm rounded-lg bg-white border border-neutral-200 focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none resize-none placeholder:text-neutral-300 transition-colors duration-200"
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4 m-0">
                {t('cart.orderSummary')}
              </h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-neutral-600 truncate pe-2">
                      {item.title} x{item.quantity}
                    </span>
                    <span className="text-neutral-800 font-medium shrink-0">
                      {formatPrice(item.price * item.quantity, i18n.language)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-pink-100/50 pt-3 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{t('cart.shipping')}</span>
                  <span className="text-success font-medium">{t('cart.freeShipping')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-pink-500">
                    {formatPrice(total, i18n.language)}
                  </span>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={submitting}>
                {t('checkout.placeOrder')}
              </Button>
            </Card>
          </motion.div>
        </div>
      </form>
    </Container>
    </PageTransition>
  )
}
