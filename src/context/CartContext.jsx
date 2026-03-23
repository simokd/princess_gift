import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'princess-gifts-cart'

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (item) => item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
      )
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(
        (item) => !(item.id === action.payload.id && item.selectedColor === action.payload.selectedColor)
      )
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, selectedColor) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        title: product.title,
        titleAr: product.titleAr,
        titleFr: product.titleFr,
        price: product.price,
        image: product.images?.[0],
        selectedColor: selectedColor || product.colors?.[0],
      },
    })
  }

  const removeItem = (id, selectedColor) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, selectedColor } })
  }

  const updateQuantity = (id, selectedColor, quantity) => {
    if (quantity < 1) {
      removeItem(id, selectedColor)
      return
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, selectedColor, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR' })
  }

  const itemCount = items?.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
