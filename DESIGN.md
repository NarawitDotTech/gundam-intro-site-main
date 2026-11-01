# DESIGN.md: Narawit "Gundam" Aunsaen, personal site

## Direction

A technical spec sheet, not a sci-fi dashboard. The site reads like a
well-set engineering document: warm paper, black ink, hairline rules,
monospaced annotations, and one signal color used sparingly. The
personality comes from typography and structure, not from glow, blur,
gradients or motion.

Rules that keep it from looking generated:

- No gradients, glows, glassmorphism, noise overlays or custom cursors.
- No cards with drop shadows. Content sits on rules (1px lines), like a table.
- Left-aligned. Nothing centered except where a single line demands it.
- One accent color, used for at most one element per screen region.
- Motion only on hover and focus state changes, 150ms, colors only.

## Color

Tokens live in `src/app/globals.css` and switch with `prefers-color-scheme`.

| Token     | Light     | Dark      | Role                                   |
|-----------|-----------|-----------|----------------------------------------|
| `paper`   | `#f2efe8` | `#131312` | Page background                        |
| `ink`     | `#161514` | `#ece9e2` | Headings, body text, primary button    |
| `muted`   | `#5d5a54` | `#a29e96` | Secondary text, labels (≥ 4.5:1)       |
| `rule`    | `#d6d1c6` | `#2f2e2b` | Hairlines, borders                     |
| `signal`  | `#c22d18` | `#ff6b4f` | Accent: status dot, link hover, marks  |

## Type

- Display and body: **Archivo** (variable width). Headings use the
  expanded width (`font-stretch: 112%`) at heavy weight; body uses normal width.
- Annotations, labels, indices: **IBM Plex Mono**, uppercase, wide tracking, 12px.
- Scale: 12 / 15 / 17 / 22 / 32 / clamp(2.75rem, 7vw, 5.5rem).
- Body line length capped at ~62ch.

## Spacing and shape

- 4px base. Section padding 96px desktop, 64px phone.
- Max content width 1120px, 20px side gutter on phones.
- Radius: 0 everywhere. Square corners suit the spec-sheet look.

## Components

- **Spec table**: `dl` rows, mono label left, value right, rule between rows.
- **Project row**: index | name + description | status. Rules between rows.
- **Button**: solid ink with paper text (primary) or underlined text link (secondary).
- **Status**: small square dot in signal color plus mono label.
