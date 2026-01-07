# Style Guide

## Principle Colors

Based on the website https://bagnascojhoel.com.br/, the principle colors are:

- **Primary Orange**: #f97316 (rgb(249, 115, 22)) - Used for accents, borders, text, and backgrounds on interactive elements.
- **Lighter Orange Variant**: #fb923c (rgb(251, 146, 60)) - Used for highlights, selection backgrounds, and geometric patterns.
- **Background/Light Gray**: #f8fafc (rgb(248, 250, 252)) - The main background color and text on primary elements.
- **White**: #ffffff - Used for text and overlays.

These colors create a clean, modern look with orange as the dominant accent color against a light background.

## Design Tokens

### Spacing
- `--spacing-xs`: 0.5rem
- `--spacing-sm`: 1rem
- `--spacing-md`: 1.5rem
- `--spacing-lg`: 2rem
- `--spacing-xl`: 3rem

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- Font Sizes:
  - `--font-size-sm`: 0.875rem
  - `--font-size-base`: 1rem
  - `--font-size-lg`: 1.25rem
  - `--font-size-xl`: 1.5rem
  - `--font-size-2xl`: 2rem
- Line Height: 1.6

### Other
- `--border-radius`: 0.5rem
- `--box-shadow`: 0 2px 4px rgba(0, 0, 0, 0.1)

## Component Patterns

### Buttons
- Class: `.btn`
- Variants: `.btn--primary` (uses primary orange)
- States: Hover changes background to lighter orange

### Navigation
- Class: `.nav`
- Mobile: Toggle with `.nav__toggle` and `.is-active` on `.nav__list`

### Cards
- Class: `.project-card`, `.article-item`, `.experience-item`
- Consistent padding, border-radius, and box-shadow

### Dark Mode
- Toggle via body class `.dark`
- Inverts background and text colors