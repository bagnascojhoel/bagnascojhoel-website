```
applyTo: *
```

# UI/UX Standards for AI Agents

This document defines the rules and templates for building web applications with high-quality UI and UX across all devices.

## UI/UX Rules

1.  **Mobile-First Design**: Design for the smallest screen first and scale up using CSS Grid and Flexbox.
2.  **Touch Targets**: Ensure interactive elements (buttons, links) have a minimum size of 44x44px.
3.  **Typography**: Use fluid typography (e.g., `clamp()`) to ensure readability across devices.
4.  **Accessibility (a11y)**: Maintain WCAG 2.1 compliance, including high contrast ratios and full keyboard navigability.
5.  **Performance**: Optimize Core Web Vitals by lazy-loading images, using modern formats (WebP/AVIF), and minimizing layout shifts (CLS).
6.  **Visual Feedback**: Provide immediate feedback for user actions (hover, active, loading, and error states).

## Documentation Template

Use this template when documenting new components or features to ensure consistency.

### 1. Design Tokens
- **Breakpoints**: Mobile: 320px, Tablet: 768px, Desktop: 1024px, Wide: 1440px.
- **Colors**: Use CSS variables for primary, secondary, surface, and error colors.
- **Spacing**: Use a 4px or 8px base grid system.

### 2. Component Guidelines
- **Buttons**: Must have `:hover`, `:focus-visible`, and `:active` states.
- **Inputs**: Must always include associated `<label>` elements and error messages.
- **Modals**: Must trap focus and be closable via the `Esc` key.

### 3. Responsive Strategy
- Use `rem` for sizing and `em` for media queries.
- Prefer `grid-template-areas` for complex layouts to simplify reordering on mobile.

### 4. Accessibility Requirements
- Use semantic HTML (`<main>`, `<nav>`, `<section>`, etc.).
- All images must have `alt` attributes.
- Interactive elements must have a visible focus ring.

### 5. Performance
- Use `priority` for LCP images.
- Implement skeleton screens for data-heavy components.
