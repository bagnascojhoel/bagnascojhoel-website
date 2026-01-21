---
applyTo: *.html, *.css, *.js
---

# Atomic Design Standards for Mockups

This document outlines the rules for creating style guides and mockups using the Atomic Design
methodology. These standards ensure that AI agents and developers can build consistent, scalable,
and maintainable UI components.

## 1. Atomic Design Hierarchy

### Atoms

- **Definition**: The smallest, indivisible units of the UI.
- **Examples**: Buttons, inputs, labels, icons, color swatches, font stacks.
- **Rules**:
  - Must be stateless or have very simple states (hover, active).
  - Should not contain other components.
  - Must use CSS variables for all design tokens (colors, spacing, typography).

### Molecules

- **Definition**: Simple groups of atoms functioning together as a unit.
- **Examples**: A search form (input + button), a form field (label + input + error message).
- **Rules**:
  - Should be reusable across different organisms.
  - Handle simple internal logic (e.g., input validation display).

### Organisms

- **Definition**: Complex UI components composed of groups of molecules and/or atoms.
- **Examples**: Navigation bar, footer, product card, hero section.
- **Rules**:
  - Can be standalone sections of a page.
  - Should be modular and independent of the page context.

### Templates

- **Definition**: Page-level objects that place components into a layout.
- **Examples**: Homepage layout, Blog post layout.
- **Rules**:
  - Focus on the content structure rather than final content.
  - Define the grid and layout constraints.

### Pages

- **Definition**: Specific instances of templates that show what the UI looks like with real
  representative content.
- **Rules**:
  - Used to test the effectiveness of the design system.
  - Should include variations (e.g., empty states, error states).

## 2. Implementation Rules

### HTML

- Use semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`).
- Ensure all interactive elements are accessible (ARIA labels where necessary).

### CSS

- **Design Tokens**: All values must come from a central set of CSS variables.
- **Methodology**: Use BEM (Block Element Modifier) or a similar naming convention to avoid style
  leakage.
- **Responsiveness**: Follow the Mobile-First approach as defined in
  [ui-ux-rules.md](ui-ux-rules.md).
- **Libraries**: If using a library (e.g., Tailwind, Bootstrap), ensure it is configured to match
  the project's design tokens.

### JavaScript

- **Minimal Behavior**: Only implement essential interactivity (e.g., mobile menu toggle, modal
  open/close, tab switching).
- **Vanilla JS**: Prefer Vanilla JS for PoCs to keep dependencies low, unless a specific framework
  is requested.
- **State**: Use simple class toggling (`.is-active`, `.is-hidden`) for state changes.

## 3. Mockup Requirements

- **Purpose**: The mockup serves as a Proof of Concept (PoC) for the design.
- **Fidelity**: High visual fidelity (matches the style guide) but low functional fidelity.
- **Documentation**: Each component must be documented with its intended use and variations.
