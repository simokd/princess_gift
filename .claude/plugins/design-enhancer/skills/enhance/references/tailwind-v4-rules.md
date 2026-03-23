# Tailwind CSS v4 Rules for This Project

## Critical: No tailwind.config.js
This project uses Tailwind CSS v4 which does NOT use tailwind.config.js.
All theme customization is done in src/index.css via the @theme block.

## @theme Block
Custom design tokens are defined with CSS custom properties:
```css
@theme {
  --color-pink-500: #EC4899;
  --shadow-card: 0 1px 3px rgba(...);
  --font-heading: 'Playfair Display', Georgia, serif;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

These become usable as Tailwind utilities:
- `--color-pink-500` -> `text-pink-500`, `bg-pink-500`, `border-pink-500`
- `--shadow-card` -> `shadow-card`
- `--font-heading` -> used via `font-[family-name:var(--font-heading)]`
- `--ease-smooth` -> `ease-smooth`

## Vite Integration
Tailwind v4 is loaded as a Vite plugin (`@tailwindcss/vite`), NOT via PostCSS.
The CSS file uses `@import "tailwindcss"` instead of `@tailwind` directives.

## Adding New Tokens
To add a new design token, add it to the @theme block in src/index.css:
```css
@theme {
  /* existing tokens... */
  --color-pink-800: #9D174D;  /* new shade */
  --shadow-inner-pink: inset 0 2px 4px rgba(244, 114, 182, 0.1);  /* new shadow */
}
```

## Important Differences from v3
- No `tailwind.config.js` -- do not create one
- No `@tailwind base/components/utilities` -- use `@import "tailwindcss"`
- No `extend` in config -- add tokens directly to @theme
- Container is NOT a built-in plugin; use the custom Container component
- Dark mode: not currently configured in this project
