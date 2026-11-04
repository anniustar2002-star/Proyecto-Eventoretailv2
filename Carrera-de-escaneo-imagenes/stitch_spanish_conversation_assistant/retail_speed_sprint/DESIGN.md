---
name: Retail Speed Sprint
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444650'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#747781'
  outline-variant: '#c4c6d2'
  surface-tint: '#3e5d9e'
  primary: '#001843'
  on-primary: '#ffffff'
  primary-container: '#002c6c'
  on-primary-container: '#7896dc'
  inverse-primary: '#b0c6ff'
  secondary: '#ad3302'
  on-secondary: '#ffffff'
  secondary-container: '#fd6b3b'
  on-secondary-container: '#5f1700'
  tertiary: '#001f1e'
  on-tertiary: '#ffffff'
  tertiary-container: '#003635'
  on-tertiary-container: '#00a9a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#244485'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#852400'
  tertiary-fixed: '#72f7f3'
  tertiary-fixed-dim: '#50dad7'
  on-tertiary-fixed: '#00201f'
  on-tertiary-fixed-variant: '#00504e'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '900'
    lineHeight: 64px
    letterSpacing: -0.04em
  metric-display-mobile:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  gutter-mobile: 0.75rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system blends institutional rigor with the kinetic adrenaline of an arcade speed run. Built for event-scale touchscreens, mobile devices, and Point-of-Sale (POS) interfaces, it honors corporate credibility while supercharging user focus through game mechanics: high-contrast scanning reticles, real-time score counters, time-attack alerts, and instant tactile feedback.

The aesthetic fuses **Corporate Precision** with **Gamified High-Performance Retail**:
- Crisp, clinical structure derived from logistics and barcode standards.
- Kinetic excitement through energetic accents, high-contrast badges, and immediate state changes.
- Large, finger-friendly targets and oversized metrics engineered for ambient event visibility across distances.

## Colors

The palette balances authoritative institution with high-velocity gameplay:

- **Dominant Base (`#002C6C` - GS1 Blue):** Anchors headers, primary interactive surfaces, core framing, and primary rankings. Conveys authority and precision.
- **Velocity Driver (`#F26334` - GS1 Orange):** Applied exclusively to urgent interactions, primary CTA trigger buttons, active countdown timers, and streak multipliers.
- **Feedback & Sector Tokens:**
  - **Capture & Hints (`#F05587` - GS1 Raspberry):** Scanning targets, optical capture viewfinders, and retail sector tags.
  - **Logistics & Success (`#22BCB9` - GS1 Teal):** Successful validation, high-accuracy triggers, and logistics badges.
  - **Correct Scan / Pass (`#7AC143` - GS1 Grass):** Point confirmations, valid barcodes, and green-light checkpoints.
  - **Pressure & Warnings (`#FF8200` - GS1 Tangerine):** Timer expiration warnings (under 10s) and streak decay states.
- **Neutrals & Surfaces:**
  - Background base: `#F4F4F4` (GS1 Light Gray) ensuring zero glare under venue lights.
  - Content containers: `#FFFFFF` with `#B1B3B3` micro-borders.
  - High-legibility typography: `#454545` (GS1 Dark Gray) on light surfaces.

## Typography

Inter is chosen for its optical legibility, neutrality, and distinct numeric clarity—vital for high-cadence barcode verification and live race clocks.

- **Metric & HUD Displays:** Utilize tabular figures (`tnum`) and extra-bold weights (`800`/`900`) to prevent visual jitter during high-speed point accumulation and ticking countdown timers.
- **Labels & System Badges:** Formatted in uppercase with letter spacing between `+0.02em` and `+0.06em`, referencing industrial POS receipts and GTIN data fields.
- **Content Hierarchy:** Clear separation between descriptive operational text (`body-md`) and critical real-time HUD elements.

## Layout & Spacing

The layout is built on an adaptive 12-column POS/Arcade grid that shifts to a focused 4-column stack on portable handheld terminals and smartphones.

- **Handheld Scanners / Mobile:** 4 columns, `1rem` margins, tight `0.75rem` gutters. Crucial operational triggers (scan button, skip, camera preview) stay pinned within the bottom thumb zone.
- **Kiosk / Desktop / Arena Monitors:** 12 columns, `1.5rem` margins, `1.25rem` gutters. Top bar accommodates player metadata, game timer, and real-time multiplier; body area splits into scanner feed (left/center) and live item inventory/scoreboard (right).
- **Rhythm:** An 8pt spatial grid anchors spacing. Gaps between scanning indicators and verification badges scale uniformly using `space-sm` (`8px`) and `space-md` (`16px`).

## Elevation & Depth

Visual hierarchy leverages crisp industrial layers rather than deep ambient shadows, ensuring quick legibility under harsh convention center and retail store lighting.

- **Level 0 (Floor):** Canvas background in `#F4F4F4`.
- **Level 1 (Cards & Registers):** Pure white (`#FFFFFF`) surfaces elevated with a 1px boundary stroke (`#B1B3B3` at 40% opacity) and an ultra-subtle offset shadow: `0px 2px 6px rgba(0, 44, 108, 0.06)`.
- **Level 2 (Active Scanning HUD & Sticky Bar):** Higher-order tactile modules resting at `0px 8px 16px rgba(0, 44, 108, 0.12)`, framing active viewfinders and floating leaderboard banners.
- **Level 3 (Modal / Score Overlays):** Modal backdrops use `#002C6C` with 80% opacity, accompanied by crisp white dialog boxes framed by a 2px `#F26334` active border.

## Shapes

The system uses `roundedness: 2` (0.5rem base radius) to bridge clean POS precision and friendly arcade dynamism:

- **Base Components:** Standard inputs, data chips, and grid cards utilize `0.5rem` (`8px`) corners.
- **Hero Containers & HUD Panels:** Large dashboard components and scanning preview boxes scale up to `rounded-lg` (`1rem` / `16px`).
- **Interactive Triggers & Streak Pills:** Pill shapes are reserved exclusively for contextual tags (e.g., category badges, product types) and time/streak status badges.
- **Reticles & Focus Points:** The camera targeting viewfinder utilizes inverted or sharp-corner indicators on top of a soft rounded bounding container to simulate commercial barcode laser readers.

## Components

### Buttons & Action Bars
- **Primary CTA ("Escanear Ahora" / "Validar"):** Large format (min height: 56px). Background in `#F26334`, text in `#FFFFFF`, with `font-weight: 700`. Active state drops 2px on the Y-axis with a subtle inset shadow to mimic mechanical POS physical keys.
- **Secondary Actions:** Background in `#002C6C`, text in `#FFFFFF`. Used for "Ver Tabla de Posiciones" and administrative navigation.
- **Ghost/Tertiary:** 1.5px border in `#002C6C` or `#B1B3B3`, transparent background, text in `#002C6C`.

### Barcode Target Viewfinder (Scanner HUD)
- Centered viewport card with rounded corners (`16px`).
- Framed with dynamic laser corner brackets that transition from `#F05587` (seeking) to `#7AC143` (detected/validated) in 150ms.
- Centered horizontal scanning laser line with pulsing opacity.

### Gamified Metric Displays (Timer & Multiplier)
- **Timer HUD:** High-visibility pill container. Background switches to `#FF8200` when under 10 seconds, pulsating red/tangerine when under 5 seconds.
- **Multiplier Badge:** Sharp contrast badge in `#22BCB9` with bold white text denoting the combo streak (e.g., `3x COMBO`).

### Cards & Leaderboards
- **Item Validation Card:** Crisp white surface, 1px `#B1B3B3` border, containing product SKU image, GTIN numerical string rendered in monospace/tabular Inter, and sector badge (e.g., "Retail", "Alimentos").
- **Leaderboard Row:** Compact list item displaying rank number, player badge, scan speed (in seconds/ms), and total score. Rank 1 features a `#FF8200` left accent strip.

### Inputs & Selection Controls
- **Input Fields:** Minimum height 48px, background `#FFFFFF`, border 1.5px `#B1B3B3`. Focused state adopts `#002C6C` outline with 3px `#002C6C` glow at 15% opacity.
- **Checkboxes & Segmented Controls:** Chunky 24px targets with `#002C6C` fill and white checkmark on selection.