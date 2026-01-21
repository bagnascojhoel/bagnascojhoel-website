---
applyTo: *.html, *.css, *.js
---

# Project Style Guide

This document defines the visual language and design tokens for the Portfolio Website v2. It follows
the [Atomic Design Standards](atomic-design-standards.md) and [UI/UX Rules](ui-ux-rules.md).

## 1. Design Tokens

### Colors

| Name                 | Value     | Usage                               |
| :------------------- | :-------- | :---------------------------------- |
| `--color-primary`    | `#3b82f6` | Primary actions, links, highlights  |
| `--color-secondary`  | `#10b981` | Success states, secondary accents   |
| `--color-background` | `#ffffff` | Main page background                |
| `--color-surface`    | `#f3f4f6` | Cards, sections, subtle backgrounds |
| `--color-text-main`  | `#111827` | Primary text content                |
| `--color-text-muted` | `#6b7280` | Secondary text, labels              |
| `--color-error`      | `#ef4444` | Error messages, destructive actions |

### Typography

- **Font Family**: Inter, system-ui, sans-serif.
- **Scale**:
  - `--text-xs`: `0.75rem` (12px)
  - `--text-sm`: `0.875rem` (14px)
  - `--text-base`: `1rem` (16px)
  - `--text-lg`: `1.125rem` (18px)
  - `--text-xl`: `1.25rem` (20px)
  - `--text-2xl`: `1.5rem` (24px)
  - `--text-3xl`: `1.875rem` (30px)

### Spacing

Based on an 8px grid system.

- `--space-1`: `0.25rem` (4px)
- `--space-2`: `0.5rem` (8px)
- `--space-4`: `1rem` (16px)
- `--space-6`: `1.5rem` (24px)
- `--space-8`: `2rem` (32px)

## 2. Atomic Components (Examples)

### Atoms

- **Buttons**:
  - `.btn-primary`: Solid background, white text.
  - `.btn-outline`: Bordered, primary color text.
- **Inputs**:
  - `.input-field`: Standard text input with focus ring.

### Molecules

- **Form Group**: Label + Input + Error message.
- **Nav Link**: Icon + Text with hover state.

### Organisms

- **Header**: Logo + Navigation + Theme Toggle.
- **Project Card**: Image + Title + Description + Tags + Link.

## 3. Mockup Implementation (PoC)

The mockup will be implemented in a single `index.html` (or a small set of files) to demonstrate the
layout and styling.

### Interactivity Goals

- Mobile menu toggle.
- Smooth scrolling to sections.
- Basic form validation feedback.
