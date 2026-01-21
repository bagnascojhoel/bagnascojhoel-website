# Style Guide v2

## Design Philosophy

Minimalist, clean, and professional design inspired by modern portfolio websites. Focus on
typography, whitespace, and subtle interactions.

## Colors

### Light Mode

- **Primary Orange**: #f97316
- **Primary Orange Light**: #fb923c
- **Primary Orange Dark**: #ea580c
- **Background**: #ffffff
- **Surface**: #fafafa
- **Text**: #171717
- **Text Secondary**: #737373
- **Border**: #e5e5e5

### Dark Mode

- **Background**: #0a0a0a
- **Surface**: #171717
- **Text**: #fafafa
- **Text Secondary**: #a3a3a3
- **Border**: #262626

## Typography

### Font Families

- **Sans-serif**: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', sans-serif)
- **Monospace**: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace

### Font Sizes

- Hero Title: clamp(2.5rem, 8vw, 4rem)
- Hero Subtitle: clamp(1.5rem, 4vw, 2rem)
- Section Title: clamp(2rem, 5vw, 2.5rem)
- Project Title: 1.25rem
- Body: 1rem (16px base)
- Small: 0.875rem

### Line Heights

- Headings: 1.1-1.2
- Body: 1.6-1.7

## Spacing

- Base unit: 8px
- Sections: 80px vertical padding
- Components: 24px padding
- Gaps: 8px, 16px, 24px, 32px

## Components

### Navigation

- Sticky position with backdrop blur
- Minimal border bottom
- Text-based links (no heavy styling)
- Smooth hover transitions on link color

### Buttons

- Two variants: Primary (filled) and Secondary (outline)
- 6px border radius
- 12px vertical, 24px horizontal padding
- Simple hover states (darken/background change)

### Cards (Projects, Articles)

- Border: 1px solid with subtle hover effect
- 12px border radius
- Change border color to primary on hover
- No heavy shadows

### Timeline

- Simple circular marker (12px)
- Left-aligned with content
- Minimal decoration

### Contact Cards

- Icon + text layout
- Same border/hover pattern as projects
- Generous internal spacing

## Interactions

- All transitions: 0.2s ease
- Hover states change border colors, not shadows
- Dark mode toggle with localStorage persistence
- Smooth scroll with offset for fixed navigation

## Layout

- Max width: 1200px
- Consistent horizontal padding: 24px
- Mobile-first responsive design
- Breakpoint: 768px

## Design Principles

1. **Typography First**: Strong hierarchy through font sizes and weights
2. **Minimal Borders**: Use subtle borders instead of shadows
3. **Generous Whitespace**: Let content breathe
4. **Subtle Interactions**: Simple, predictable hover states
5. **Clean Color Palette**: Neutral grays with orange accent
6. **System Fonts**: Fast loading, native feel
