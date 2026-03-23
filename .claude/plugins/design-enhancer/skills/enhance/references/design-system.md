# Princess Gifts Design System Reference

## Color Tokens (from src/index.css @theme block)

### Pink Scale (Primary)
| Token | Hex | Usage |
|-------|-----|-------|
| pink-50 | #FDF2F8 | Subtle backgrounds, hover states |
| pink-100 | #FCE7F3 | Card borders (with /50 opacity), light fills |
| pink-200 | #FBCFE8 | Badge borders, selection highlight, scrollbar |
| pink-300 | #F9A8D4 | Outlined button borders, scrollbar hover |
| pink-400 | #F472B6 | Focus rings, input focus border, icon accent |
| pink-500 | #EC4899 | Primary buttons, links, prices, brand text |
| pink-600 | #DB2777 | Primary button hover |
| pink-700 | #BE185D | Primary button active |

### Brand
| Token | Hex | Usage |
|-------|-----|-------|
| brand-bg | #FFF9FB | Page background (body) |
| brand-surface | #FFFBFE | Card surfaces when needed |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| gold | #F59E0B | Ratings, premium indicators |
| success | #10B981 | In-stock, order success, positive trends |
| error | #EF4444 | Out-of-stock, form errors, delete actions |

## Shadow Tokens (pink-tinted)
All shadows use rgba(244, 114, 182, ...) which is pink-400 with varying opacity.
- `shadow-soft` -- barely visible, subtle elevation
- `shadow-card` -- standard card resting state
- `shadow-md` -- medium emphasis
- `shadow-lg` -- hover states, elevated cards
- `shadow-xl` -- modals, dropdowns

## Font Tokens
- `--font-sans`: Inter (body text, UI elements)
- `--font-heading`: Playfair Display (h1-h6, brand name)

## Animation Tokens
- `--ease-smooth`: cubic-bezier(0.4, 0, 0.2, 1) -- use as `ease-smooth` in Tailwind
- `--duration-fast`: 150ms
- `--duration-normal`: 200ms
- `--duration-slow`: 300ms
