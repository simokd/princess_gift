import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/ui/Container'
import PageTransition from '../../components/ui/PageTransition'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import CartItemComponent from '../../components/common/CartItem'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
}

export default function Cart() {
  const { t, i18n } = useTranslation()
  const { items, total, itemCount, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center justify-center text-center max-w-sm mx-auto"
        >
          <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-pink-300" />
          </div>
          <h2 className="text-2xl mb-2">{t('cart.empty')}</h2>
          <p className="text-neutral-400 mb-6 text-sm">{t('cart.emptyMessage')}</p>
          <Link to="/products">
            <Button icon={ArrowRight} iconPosition="end">{t('cart.continueShopping')}</Button>
          </Link>
        </motion.div>
      </Container>
    )
  }

  return (
    <PageTransition>
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl"
        >
          {t('cart.title')}
        </motion.h1>
        <span className="text-sm text-neutral-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <motion.div
          className="lg:col-span-2"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <Card>
            {items.map((item, index) => (
              <motion.div key={`${item.id}-${item.selectedColor}`} variants={fadeIn}>
                <CartItemComponent item={item} />
              </motion.div>
            ))}
          </Card>

          {/* Continue Shopping */}
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-pink-500 transition-colors mt-4 no-underline"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            {t('cart.continueShopping')}
          </Link>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-800 mb-5 m-0">
              {t('cart.orderSummary')}
            </h3>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  {t('cart.subtotal')} ({itemCount})
                </span>
                <span className="font-medium text-neutral-700">
                  {formatPrice(total, i18n.language)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{t('cart.shipping')}</span>
                <span className="font-medium text-success">{t('cart.freeShipping')}</span>
              </div>
            </div>

            <div className="border-t border-pink-100/50 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-800">{t('cart.total')}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(total, i18n.language)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button className="w-full" size="lg" icon={ArrowRight} iconPosition="end">
                {t('cart.proceedToCheckout')}
              </Button>
            </Link>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Truck className="w-3.5 h-3.5" />
                Free Shipping
              </div>
            </div>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-center text-xs text-neutral-300 hover:text-error transition-colors cursor-pointer bg-transparent border-none"
            >
              {t('common.delete')} {t('common.all').toLowerCase()}
            </button>
          </Card>
        </motion.div>
      </div>
    </Container>
    </PageTransition>
  )
}
