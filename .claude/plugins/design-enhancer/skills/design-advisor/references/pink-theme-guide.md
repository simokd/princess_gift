# Pink Theme Visual Guide

## Gradient Combinations
- Hero/CTA: `bg-gradient-to-r from-pink-500 to-pink-600`
- Subtle banner: `bg-gradient-to-r from-pink-50 to-white`
- Card accent: `bg-gradient-to-b from-pink-50/50 to-transparent`
- Text gradient: `bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent`
- Overlay: `bg-gradient-to-t from-black/60 via-black/20 to-transparent`

## Decorative Patterns
- Dotted background: CSS `radial-gradient(circle, #FBCFE8 1px, transparent 1px)` with `background-size: 20px 20px`
- Blob shapes: Use SVG blobs with pink-100/pink-200 fill, absolute positioned with low opacity
- Divider with heart: A horizontal rule with a centered heart icon in pink-300
- Sparkle effects: Small animated dots using Framer Motion with pink-300/pink-400

## Interactive States Summary
| State | Color Pattern |
|-------|--------------|
| Default | neutral-600 text, white bg |
| Hover | pink-500 text or pink-50 bg |
| Active/Pressed | pink-600/pink-700 |
| Focus | 2px solid pink-400 outline (via focus-visible) |
| Selected/Active | pink-50 bg, pink-500 text |
| Disabled | opacity-50, cursor-not-allowed |
| Error | error text, red-50 bg |
| Success | success text, emerald-50 bg |

## Card Style Variations
1. **Standard Card**: `bg-white rounded-xl border border-pink-100/50 shadow-card`
2. **Hover Card**: Add `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
3. **Featured Card**: Add `ring-2 ring-pink-200` or `border-pink-300`
4. **Flat Card**: `bg-white rounded-xl border border-neutral-100` (admin style)
5. **Glass Card**: `bg-white/80 backdrop-blur-md rounded-xl border border-pink-100/30`

## Button Style Variations
1. **Primary**: `bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700`
2. **Secondary**: `bg-pink-50 text-pink-600 hover:bg-pink-100`
3. **Outline**: `border border-pink-300 text-pink-500 hover:bg-pink-50`
4. **Ghost**: `text-neutral-600 hover:bg-pink-50 hover:text-pink-500`
5. **Danger**: `bg-error text-white hover:bg-red-600`

## Typography Scale for E-commerce
- Product card title: `text-sm font-medium text-neutral-800`
- Product card price: `text-base font-semibold text-pink-500`
- Sale/original price: `text-xs text-neutral-400 line-through`
- Product detail title: `text-2xl md:text-3xl` (uses heading font)
- Product detail price: `text-3xl font-bold text-pink-500`
- Section heading: `text-2xl md:text-3xl` (uses heading font)
- Body text: `text-sm text-neutral-600 leading-relaxed`
- Label: `text-sm font-medium text-neutral-700`
- Caption/helper: `text-xs text-neutral-400`
- Badge text: `text-xs font-medium`

## Micro-interaction Recipes

### Hover Lift (cards, images)
```
hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-smooth
```

### Button Press
```
active:scale-[0.98] transition-transform duration-150
```

### Image Zoom on Hover
```
group overflow-hidden rounded-xl
  > img: group-hover:scale-105 transition-transform duration-500
```

### Fade In on Scroll (with Framer Motion)
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-50px' }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
>
```

### Staggered List Reveal
```jsx
<motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.div>
```

### Pulse on New Item (cart badge)
```jsx
<motion.span
  key={count}
  initial={{ scale: 1.5 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
>
  {count}
</motion.span>
```
