# ClipMonk — Design System

> **Layer 2: Source of Truth for Design.** This file defines every design token, typographic scale, spacing unit, color value, and component specification. When Claude Code generates frontend code, it must reference these tokens — never hardcode values.

---

## COLOR TOKENS

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#06060b` | Page background |
| `--bg-card` | `#0e0e16` | Card / panel backgrounds |
| `--bg-elevated` | `#14141f` | Elevated elements (dropdowns, modals) |
| `--bg-glass` | `rgba(14,14,22,0.6)` | Glass morphism panels |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--teal` | `#00e5c7` | Primary action, CTAs, links, active states |
| `--teal-dark` | `#00b89e` | Primary hover, gradients |
| `--amber` | `#ff6b35` | Secondary action, accent, premium badges |
| `--amber-light` | `#ff8f5e` | Amber hover, gradients |
| `--lavender` | `#8b7cf6` | Tertiary, AI features, creative actions |
| `--lavender-light` | `#a99cfa` | Lavender hover |

### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `--text` | `#e8e6f0` | Primary text |
| `--text-muted` | `#7a7694` | Secondary text, labels, timestamps |
| `--text-dim` | `#4a4660` | Placeholder text, disabled text |

### Border Colors

| Token | Hex | Usage |
|---|---|---|
| `--border` | `#1e1c2e` | Default borders |
| `--border-light` | `#2a2840` | Hover borders, dividers |
| `--border-focus` | `var(--teal)` | Focus ring |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `--success` | `#34d399` | Success states, positive metrics |
| `--warning` | `#fbbf24` | Warnings, approaching limits |
| `--error` | `#f87171` | Errors, destructive actions |
| `--pink` | `#f472b6` | Instagram, special badges |

### Gradients

| Token | Value | Usage |
|---|---|---|
| `--gradient-primary` | `linear-gradient(135deg, var(--teal), var(--lavender))` | Primary gradient text, hero accents |
| `--gradient-amber` | `linear-gradient(135deg, var(--amber), var(--amber-light))` | Amber gradient text |
| `--gradient-cta` | `linear-gradient(135deg, var(--teal), var(--teal-dark))` | CTA buttons background |
| `--gradient-accent` | `linear-gradient(135deg, var(--amber), #e55a2b)` | Accent buttons background |
| `--glow-teal` | `0 0 40px #00e5c726, 0 0 80px #00e5c70d` | Teal glow shadow |
| `--glow-amber` | `0 0 30px #ff6b354d` | Amber glow shadow |

### Platform Brand Colors

| Platform | Color | Usage |
|---|---|---|
| YouTube | `#ff0000` | Platform icons, badges |
| TikTok | `#000000` / `#ff0050` | Platform icons |
| Instagram | `linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)` | Platform icons |
| Facebook | `#1877f2` | Platform icons |
| LinkedIn | `#0a66c2` | Platform icons |
| Twitter/X | `#000000` | Platform icons |
| Pinterest | `#e60023` | Platform icons |

---

## TYPOGRAPHY

### Font Families

| Token | Value | Usage |
|---|---|---|
| `--font-heading` | `'Syne', sans-serif` | Headings, hero text, brand moments |
| `--font-body` | `'Plus Jakarta Sans', sans-serif` | Body text, UI text, labels, inputs |
| `--font-mono` | `'JetBrains Mono', monospace` | Code blocks, API keys, technical values |

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap
```

### Type Scale

| Level | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| Display | Syne | 64px | 800 | 1.0 | -0.03em | Hero headline |
| H1 | Syne | 48px | 700 | 1.1 | -0.02em | Page titles (marketing) |
| H2 | Syne | 36px | 700 | 1.2 | -0.02em | Section titles |
| H3 | Syne | 28px | 600 | 1.3 | -0.01em | Card titles, modal titles |
| H4 | Syne | 22px | 600 | 1.3 | -0.01em | Subsection titles |
| H5 | Plus Jakarta Sans | 18px | 600 | 1.4 | -0.01em | Widget titles |
| Body Large | Plus Jakarta Sans | 18px | 400 | 1.7 | 0 | Marketing body text |
| Body | Plus Jakarta Sans | 15px | 400 | 1.6 | 0 | Default body text |
| Body Small | Plus Jakarta Sans | 13px | 400 | 1.5 | 0 | Secondary text, metadata |
| Caption | Plus Jakarta Sans | 11px | 500 | 1.4 | 0.02em | Labels, badges, timestamps |
| Button | Plus Jakarta Sans | 15px | 600 | 1.0 | -0.01em | Button text |
| Input | Plus Jakarta Sans | 14px | 400 | 1.0 | 0 | Form inputs |

---

## SPACING SCALE

Base unit: 4px

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight inline spacing |
| `--space-2` | 8px | Icon-to-text gap, tight padding |
| `--space-3` | 12px | Input padding, small gaps |
| `--space-4` | 16px | Default padding, card inner |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Card padding, form gaps |
| `--space-8` | 32px | Large gaps, section padding |
| `--space-10` | 40px | Page section gaps |
| `--space-12` | 48px | Major section breaks |
| `--space-16` | 64px | Hero padding |
| `--space-20` | 80px | Marketing section gaps |

---

## BORDER RADIUS

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Small elements, tags |
| `--radius-md` | 10px | Inputs, small cards |
| `--radius-lg` | 12px | Buttons, cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Hero cards, feature cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## SHADOWS

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.2)` | Dropdowns, tooltips |
| `--shadow-md` | `0 8px 24px rgba(0,0,0,0.3)` | Cards, popovers |
| `--shadow-lg` | `0 20px 40px rgba(0,0,0,0.3)` | Modals, elevated panels |
| `--shadow-glow-teal` | `0 0 30px #00e5c74d` | Teal button hover |
| `--shadow-glow-amber` | `0 0 30px #ff6b354d` | Amber button hover |

---

## EFFECTS

### Glass Morphism
```css
.glass {
  background: rgba(14, 14, 22, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

### Film Grain Overlay
```css
.grain {
  position: fixed;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  width: 200%; height: 200%;
  background: transparent url("...fractalNoise SVG...") repeat;
  animation: grain 8s steps(10) infinite;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.5;
}
```
Always render the grain overlay at the root layout level. It's a signature ClipMonk visual element.

### Animations

| Name | Duration | Easing | Usage |
|---|---|---|---|
| `slide-up` | 0.5s | ease-out | Page transitions, card entrances |
| `slide-in-right` | 0.4s | ease-out | Sidebar elements, list items |
| `float` | 6s | ease-in-out | Hero decorative elements |
| `pulse-glow` | 3s | ease-in-out | Active indicators, highlights |
| `spin-slow` | 20s | linear | Loading states, decorative |
| `cursor-blink` | 1s | step-end | Typewriter effect |

### Hover Lift
```css
.lift {
  transition: transform 0.3s, box-shadow 0.3s;
}
.lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

---

## COMPONENT SPECIFICATIONS

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary (`.bp`) | `var(--gradient-cta)` | `var(--bg)` (dark) | none | Glow shadow + translateY(-2px) |
| Secondary (`.bs`) | transparent | `var(--text)` | 1px solid `var(--border-light)` | Border → teal, text → teal |
| Accent (`.ba`) | `var(--gradient-accent)` | white | none | Glow shadow + translateY(-2px) |
| Ghost | transparent | `var(--text-muted)` | none | text → `var(--text)` |
| Destructive | transparent | `var(--error)` | 1px solid `var(--error)` | bg → error, text → white |

**All buttons:** border-radius 12px, padding 12px 28px, font-size 15px, font-weight 600, Plus Jakarta Sans.

### Inputs

- Background: `var(--bg-card)`
- Border: 1px solid `var(--border)`
- Border radius: 10px
- Padding: 12px 16px
- Font: Plus Jakarta Sans, 14px
- Focus: border-color → `var(--teal)`
- Placeholder: `var(--text-dim)`

### Cards

- Background: `var(--bg-card)`
- Border: 1px solid `var(--border)`
- Border radius: 16px (large cards) or 12px (small cards)
- Padding: 24px
- Hover (interactive): lift effect

### Badges / Tags

- Background: color at 15% opacity (e.g., `#00e5c726`)
- Text: the full color
- Padding: 4px 10px
- Border radius: 6px
- Font: 11px, weight 600

### Sidebar

- Width: 240px (expanded), 60px (collapsed)
- Background: `var(--bg-card)`
- Border right: 1px solid `var(--border)`
- Nav items: 44px height, 12px border-radius, 12px horizontal padding
- Active state: background `rgba(0, 229, 199, 0.1)`, text `var(--teal)`, left accent bar (3px, teal)
- Hover: background `rgba(255, 255, 255, 0.03)`

### Data Tables (Admin)

- Header: `var(--bg-elevated)`, font-weight 600, text-transform uppercase, font-size 11px, letter-spacing 0.05em
- Rows: `var(--bg-card)`, hover `rgba(255, 255, 255, 0.02)`
- Alternating rows: not used (rely on hover)
- Cell padding: 12px 16px
- Borders: bottom 1px solid `var(--border)`

### Modals / Dialogs

- Overlay: `rgba(0, 0, 0, 0.7)` with backdrop-filter blur(4px)
- Container: `var(--bg-elevated)`, border-radius 20px, max-width 520px
- Padding: 32px
- Title: H3 (Syne, 28px, 600)
- Close button: top-right, ghost button

### Toast Notifications

- Position: bottom-right
- Background: `var(--bg-elevated)`
- Border: 1px solid color (success=green, error=red, warning=amber, info=teal)
- Left accent bar: 4px solid color
- Auto-dismiss: 5 seconds
- Animation: slide-in from right

---

## RESPONSIVE BREAKPOINTS

| Name | Min Width | Usage |
|---|---|---|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape, small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Responsive Behaviors

- **Sidebar:** Collapsed to icon-only below `lg`. Drawer overlay on mobile (`< md`).
- **Data tables:** Horizontal scroll below `lg`. Card layout below `md`.
- **Grid layouts:** 3 columns on `xl`, 2 on `md`, 1 on `sm`.
- **Modal widths:** Full-screen below `sm`, centered dialog above.
- **Typography:** Display drops to 40px below `md`. Body stays 15px.

---

## ICON SYSTEM

**Library:** Lucide React (`lucide-react`)
**Default size:** 18px (nav items), 16px (buttons), 14px (inline), 24px (feature cards)
**Stroke width:** 2 (default), 1.5 (decorative/large icons)
**Color:** Inherits `currentColor` from parent text color

---

## TAILWIND CSS 4 CONFIGURATION

When migrating to shadcn/ui + Tailwind, map the above tokens to Tailwind's config:

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#06060b', card: '#0e0e16', elevated: '#14141f' },
        teal: { DEFAULT: '#00e5c7', dark: '#00b89e' },
        amber: { DEFAULT: '#ff6b35', light: '#ff8f5e' },
        lavender: { DEFAULT: '#8b7cf6', light: '#a99cfa' },
        text: { DEFAULT: '#e8e6f0', muted: '#7a7694', dim: '#4a4660' },
        border: { DEFAULT: '#1e1c2e', light: '#2a2840' },
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px', md: '10px', lg: '12px', xl: '16px', '2xl': '20px',
      },
    },
  },
}
```

---

*This design system is the visual source of truth. For what to build, see `PRD.md`. For how to build, see `CLAUDE.md`.*
