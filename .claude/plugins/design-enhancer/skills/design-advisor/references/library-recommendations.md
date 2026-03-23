# Library Recommendations for Princess Gifts

## Tier 1: Install Immediately

### clsx (v2+)
```bash
npm install clsx
```
Purpose: Conditional className construction.
Current pain: Template literals with nested ternaries in every component.
After: `className={clsx('base', { 'active-class': isActive }, className)}`

### tailwind-merge (v2+)
```bash
npm install tailwind-merge
```
Purpose: Intelligently merge Tailwind classes, preventing conflicts.
Create `src/utils/cn.js`:
```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs) => twMerge(clsx(inputs))
```

## Tier 2: Install When Ready

### @tailwindcss/typography
```bash
npm install @tailwindcss/typography
```
Add to CSS: `@plugin "@tailwindcss/typography"`
Purpose: Beautiful prose styling for product descriptions.
Usage: `<div className="prose prose-pink">`

### embla-carousel-react
```bash
npm install embla-carousel-react embla-carousel-autoplay
```
Purpose: Replace custom HeroCarousel with proper carousel.
Benefits: Native RTL, touch/swipe, accessibility, plugins ecosystem.

### react-intersection-observer
```bash
npm install react-intersection-observer
```
Purpose: Trigger Framer Motion animations on scroll.
Usage:
```jsx
import { useInView } from 'react-intersection-observer'
const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
```

## Tier 3: Optional Enhancements

### sonner
```bash
npm install sonner
```
Purpose: Replace custom Toast with a polished, accessible toast library.
Note: The existing Toast implementation works. Only switch if you want
features like promise toasts, rich content, swipe-to-dismiss.

### @radix-ui/react-dialog (and other Radix primitives)
```bash
npm install @radix-ui/react-dialog
```
Purpose: Accessible, headless dialog/modal with proper focus trapping.
Note: Only if accessibility audit reveals gaps in current Modal.
