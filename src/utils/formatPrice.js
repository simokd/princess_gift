export function formatPrice(price, language = 'en') {
  const formatted = price.toFixed(2)

  if (language === 'ar') {
    return `${formatted} د.م`
  }

  return `${formatted} MAD`
}
