import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('princess-gifts-favorites', [])

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const isFavorite = (productId) => favorites.includes(productId)

  const favoriteCount = favorites.length

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, favoriteCount }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
