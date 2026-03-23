---
name: enhance
description: Enhance the visual design of a React component following the Princess Gifts pink design system. Takes a component file path and rewrites it with improved styling, animations, and accessibility.
argument-hint: <component-path>
allowed-tools: [Read, Glob, Grep, Edit, Write, Bash, Agent]
---

# /enhance - Component Design Enhancement

You are enhancing a component for the **Princess Gifts** e-commerce application.
This is a React 19 + Tailwind CSS v4 project with a pink-themed design system.

## Step 1: Read Context

Before making any changes:
1. Read the target component file provided as the argument: `$ARGUMENTS`
2. Read `src/index.css` to understand the current @theme design tokens
3. Read `src/components/ui/index.js` to see available UI primitives
4. Read the relevant UI primitives that the component uses or should use (Button, Card, Badge, Input, Modal, etc.)
5. Read any parent or sibling components to understand usage context

## Step 2: Analyze and Plan

Evaluate the component against these criteria:
- Is it using the design system tokens from @theme (pink color scale, shadows, fonts)?
- Does it use existing UI primitives from `src/components/ui/` instead of raw HTML?
- Are Tailwind classes well-organized (layout > spacing > typography > colors > effects)?
- Does it have appropriate hover/focus/active states?
- Does it support RTL? (this project uses `start`/`end` instead of `left`/`right`)
- Does it have Framer Motion animations where appropriate?
- Are interactive elements accessible (aria labels, focus-visible, keyboard navigation)?

## Step 3: Apply the Design System

### Color Palette (use ONLY these)
- **Primary actions / highlights**: `pink-500` (text, bg), `pink-600` (hover), `pink-700` (active)
- **Secondary / subtle backgrounds**: `pink-50`, `pink-100`
- **Borders**: `pink-100/50` (cards), `pink-200` (badges), `pink-300` (outlined buttons)
- **Brand backgrounds**: `brand-bg` (#FFF9FB page background), `brand-surface` (#FFFBFE)
- **Semantic**: `success` (#10B981), `error` (#EF4444), `gold` (#F59E0B)
- **Neutrals**: `neutral-400` (placeholder/icons), `neutral-500` (secondary text), `neutral-600` (body text), `neutral-700` (labels), `neutral-800` (strong text), `neutral-900` (headings)

### Typography
- Body text: `font-sans` (Inter) -- this is the default, no class needed
- Headings (h1-h6): use `font-[family-name:var(--font-heading)]` for brand headings, or rely on the CSS base rule for h1-h6
- Never use arbitrary font sizes; stick to Tailwind scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

### Shadows (pink-tinted, defined in @theme)
- `shadow-soft` -- very subtle, for filter panels and category cards
- `shadow-card` -- default card elevation
- `shadow-md` -- medium emphasis
- `shadow-lg` -- hover states and elevated elements
- `shadow-xl` -- modals and overlays

### Animations
- Use `transition-all duration-200 ease-smooth` for micro-interactions
- Use `transition-colors` when only color changes (hover states on text/links)
- Use `transition-transform duration-300` for scale/translate effects
- Use Framer Motion for:
  - Page-level transitions (wrap with PageTransition component)
  - Modal/overlay enter/exit (AnimatePresence + motion.div)
  - Staggered list reveals
  - Image transitions

### Spacing & Layout
- Container: use the `<Container>` component (max-w-7xl, responsive px)
- Card padding: `p-6` (default), `p-4` for compact cards, `p-5` for KPI-style
- Grid gaps: `gap-4` (compact), `gap-6` (standard), `gap-8` (sections)
- Section spacing: `mt-16 mb-16` between major sections, `mt-8 mb-8` for sub-sections

### Border Radius
- Cards: `rounded-xl`
- Buttons: `rounded-md` (sm), `rounded-lg` (md/lg)
- Badges/pills: `rounded-full`
- Modal panels: `rounded-2xl`
- Images in cards: no extra rounding (use `overflow-hidden` on parent)

### RTL Support Rules
- ALWAYS use `start`/`end` instead of `left`/`right`: `ps-3` not `pl-3`, `me-2` not `mr-2`, `text-start` not `text-left`
- ALWAYS use `ms-` / `me-` / `ps-` / `pe-` for directional margin/padding
- For absolute positioning: `start-0` not `left-0`, `end-3` not `right-3`
- For borders: `border-e` not `border-r`, `rounded-s-lg` not `rounded-l-lg`
- For RTL translate overrides: reference AdminSidebar.jsx pattern (`ltr:-translate-x-full rtl:translate-x-full`)

## Step 4: Use UI Primitives

Always prefer existing UI components over raw HTML:
- `<Button>` instead of `<button>` with manual styling -- supports variant, size, loading, icon props
- `<Card>` instead of `<div>` with card styling -- supports hover, padding props
- `<Input>` instead of `<input>` -- supports label, error, icon props
- `<Select>` instead of `<select>` -- supports label, error, options, placeholder props
- `<Badge>` instead of `<span>` with badge styling -- supports variant (pink, success, error, gold, neutral)
- `<Modal>` instead of custom dialog -- supports size, title, footer props
- `<IconButton>` instead of icon-only buttons -- supports variant (default, pink, danger), active state
- `<Spinner>` for loading states
- `<QuantitySelector>` for quantity inputs
- `<Container>` for page-width wrappers
- `<PageTransition>` to wrap page-level content for enter/exit animations

Import from `../../components/ui` (barrel export) when possible.

## Step 5: className Construction

Use the `cn()` utility from `src/utils/cn.js` (clsx + tailwind-merge):

```jsx
import { cn } from '../../utils/cn'

// Simple conditional
className={cn('base-classes', isActive && 'active-class', className)}

// Object syntax
className={cn('base-classes', { 'active-class': isActive, 'disabled-class': isDisabled })}

// Variant mapping
className={cn(variants[variant], sizes[size], className)}
```

If `cn` is not yet importable (check first), fall back to clean template literals.

## Step 6: Accessibility Checklist

For every enhanced component, verify:
- All interactive elements have `cursor-pointer`
- All icon-only buttons have `aria-label`
- Focus states use `focus-visible` (the global CSS sets `outline: 2px solid #F472B6`)
- Color is never the only indicator of state (add text or icons too)
- Images have meaningful `alt` text
- Form inputs have associated labels

## Step 7: Output

After enhancing:
1. Show what changed and why (brief bullet list)
2. If you notice the component would benefit from a new UI primitive that does not exist, suggest creating one
3. If a library from the recommended list would help, mention it but do NOT install it -- just note the recommendation

Remember: this is an e-commerce site selling gifts. The aesthetic should be:
elegant, feminine, warm, inviting. Avoid harsh contrasts. Prefer soft gradients
(pink-50 to white), subtle shadows, and gentle animations.
