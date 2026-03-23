# Component Patterns in Princess Gifts

## UI Primitive Pattern
All UI components in src/components/ui/ follow this pattern:
- Accept a `className` prop for extension
- Use variant/size objects for style mappings
- Spread `...props` onto the root element
- Export as default function components
- Use forwardRef when the component wraps a native form element (Input, Select)

## Variant Object Pattern
```jsx
const variants = {
  primary: 'bg-pink-500 text-white hover:bg-pink-600',
  secondary: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  outline: 'border border-pink-300 text-pink-500 hover:bg-pink-50',
  ghost: 'text-neutral-600 hover:bg-pink-50 hover:text-pink-500',
  danger: 'bg-error text-white hover:bg-red-600',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}
```

## Icon Pattern
- Icons from `lucide-react`
- Standard sizes: `w-4 h-4` (in buttons/badges), `w-5 h-5` (in nav/sidebar), `w-3 h-3` (tiny)
- Passed as prop: `icon: Icon` then rendered as `<Icon className="w-4 h-4" />`
- Color follows parent text color via `text-current` or explicit: `text-neutral-400`, `text-pink-500`

## Framer Motion Pattern
- Page transitions: wrap content in `<PageTransition>` component
- Modal: AnimatePresence > motion.div with opacity + scale + y
- Toasts: motion.div with opacity + y + scale, exit with x offset
- Standard easing: `[0.4, 0, 0.2, 1]`
- Standard durations: 0.2s (fast), 0.3s (normal), 0.5s (slow/hero)

## i18n Pattern
- All user-facing text uses `t('key')` from `useTranslation()`
- Multi-language fields: `product.title` / `product.titleAr` / `product.titleFr`
- Language detection: `i18n.language === 'ar'` for RTL
- Number formatting: `formatPrice(value, i18n.language)`

## State Management Pattern
- React Context + useReducer for global state (Cart, Favorites, AdminAuth)
- Local state with useState for component-level state
- localStorage persistence via useEffect sync
- Custom hooks: `useCart()`, `useFavorites()`, `useToast()`

## File Organization
- `src/components/ui/` -- Design system primitives (Button, Card, Input, etc.)
- `src/components/common/` -- Shared business components (ProductCard, CartItem, etc.)
- `src/components/sections/` -- Page sections (Navbar, Footer, HeroCarousel, etc.)
- `src/components/layouts/` -- Layout wrappers (ClientLayout, AdminLayout)
- `src/pages/client/` -- Client-facing pages
- `src/pages/admin/` -- Admin pages
- `src/context/` -- React contexts
- `src/services/` -- API service modules
- `src/hooks/` -- Custom hooks
- `src/utils/` -- Utility functions (cn.js, formatPrice.js, constants.js)
