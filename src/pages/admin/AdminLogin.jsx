import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { t } = useTranslation()
  const { isAuthenticated, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!login(password)) {
      setError(t('admin.wrongPassword'))
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center mx-auto mb-4 shadow-card"
          >
            <Lock className="w-8 h-8 text-pink-400" />
          </motion.div>
          <h1 className="text-2xl mb-1">{t('admin.login')}</h1>
          <p className="text-sm text-neutral-500">Princess Gifts</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card p-6 space-y-4 border border-pink-100/50"
        >
          <div className="relative">
            <Input
              label={t('admin.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.enterPassword')}
              error={error}
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-[38px] text-neutral-400 hover:text-neutral-600 cursor-pointer bg-transparent border-none p-0 transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full" size="lg">
            {t('admin.login')}
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}
