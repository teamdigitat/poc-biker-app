---
name: Riding Verse Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb4'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8980'
  outline-variant: '#5b4039'
  surface-tint: '#ffb5a0'
  primary: '#ffb5a0'
  on-primary: '#5f1500'
  primary-container: '#ff5722'
  on-primary-container: '#541200'
  inverse-primary: '#b02f00'
  secondary: '#fff3d2'
  on-secondary: '#3a3000'
  secondary-container: '#fdd400'
  on-secondary-container: '#6f5c00'
  tertiary: '#00daf3'
  on-tertiary: '#00363d'
  tertiary-container: '#00a0b3'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#862200'
  secondary-fixed: '#ffe170'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  ride-mode-stat:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.04em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  regional-indicator:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  touch-target-min: 44px
  touch-target-gloved: 56px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is rooted in the intersection of grit and high-performance technology. It targets the modern Indian motorcyclist who demands both adventure and absolute reliability. The visual language evokes the feeling of a premium digital instrument cluster—high-contrast, hyper-functional, and immediate.

The design style is **High-Contrast / Tech-Forward**. It utilizes a deep charcoal foundation to minimize glare during outdoor rides, punctuated by vibrant safety accents. The aesthetic is clean and systematic, drawing inspiration from automotive HUDs (Heads-Up Displays) and rugged outdoor equipment. It prioritizes legibility at a glance and ease of interaction under demanding physical conditions.

## Colors

This design system utilizes a **Dark Mode Default** palette optimized for high-glare outdoor environments and OLED power efficiency.

- **Primary (Electric Orange):** Used for primary actions, branding, and energetic highlights. It signifies momentum.
- **Secondary (Safety Yellow):** Reserved for cautionary information, toggles, and high-visibility data points like speed or navigation turns.
- **Tertiary (Cyan Tech):** Used for "Garage" and technical data—battery health, engine temperature, and connectivity status.
- **Neutral (Deep Charcoal):** The foundation. `#121212` provides the base, with `#1E1E1E` used for cards and elevated surfaces to create depth without losing contrast.
- **SOS Red:** A dedicated high-saturation red (`#FF0000`) reserved exclusively for emergency features and critical safety alerts.

## Typography

The typography strategy balances aggressive brand presence with utilitarian clarity. 

- **Montserrat** is used for headlines to convey a sense of strength and geometric precision. 
- **Inter** handles all body copy and functional UI text, chosen for its exceptional legibility and support for various weights.
- **Space Grotesk** is introduced for technical labels and "Ride Mode" statistics, offering a futuristic, monospaced-adjacent feel that aids in quick numerical recognition.

For regional language support, indicators should always be paired with their native script (e.g., "Hindi | हिंदी") using Inter to ensure consistent vertical alignment across multi-script layouts.

## Layout & Spacing

The layout utilizes a **Fluid Grid** with specific affordances for gloved hands. The vertical rhythm is built on a 4px baseline, but interaction targets are oversized by design.

- **Mobile:** 4-column grid with 20px outside margins. All primary buttons must meet a **56px minimum height** for "Glove-Friendliness."
- **Tablet/Dashboard:** 8-column grid with 32px gutters.
- **Ride Mode:** A specialized layout where the grid shifts to a 2-column high-impact view, prioritizing top-level metrics and navigation arrows over secondary information.

Spacing between functional groups should be generous (`stack-lg`) to prevent accidental taps while the vehicle is in motion or vibrating.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Glow Effects** rather than traditional shadows, which are often invisible on pure black backgrounds.

1.  **Base Layer:** `#121212` (The road).
2.  **Card Layer:** `#1E1E1E` with a subtle 1px border of `#2C2C2C` to define edges.
3.  **Active/Interaction Layer:** Elements in focus utilize a subtle outer glow (bloom) using the Primary Electric Orange color (10-15% opacity) to simulate the look of illuminated dashboard hardware.
4.  **Overlay Layer:** Full-screen modals for SOS or navigation prompts use a backdrop blur (12px) to maintain context while isolating the critical action.

## Shapes

The shape language is **Soft-Industrial**. We avoid fully round corners to maintain a "rugged" and "mechanical" feel, opting for precise, smaller radii that feel engineered rather than organic.

- **Small Components (Chips/Inputs):** 0.25rem (4px) corner radius.
- **Medium Components (Buttons/Cards):** 0.5rem (8px) corner radius.
- **Large Containers (Garage Sheets):** 0.75rem (12px) corner radius.

Iconography must be "thick-stroked" (2px minimum) with slightly rounded terminals to ensure they remain legible when viewed from a distance or through a helmet visor.

## Components

### Buttons
- **Primary:** Solid Electric Orange with black text. 56px height.
- **Secondary:** Transparent with Safety Yellow 2px border.
- **SOS:** Massive, circular floating action button (FAB) with a pulsing red outer ring. Requires a "Long Press" (2 seconds) to activate to prevent false triggers during rides.

### Garage Dashboard
- Cards should feature high-quality "cut-out" PNGs of the user's motorcycle. 
- Technical stats (Fuel, Oil, Battery) use progress bars in Tertiary Cyan.

### Input Fields
- Dark grey fills with "bottom-border only" when inactive, shifting to full Safety Yellow outlines when focused. 
- Large numeric keypads for PIN/Odometer entries.

### Ride Mode Feed
- Simplified navigation cards with "Next Turn" icons at 80x80px size. 
- High-contrast text labels with zero unnecessary ornamentation.

### Community Feed
- Image-heavy cards with "Join Ride" buttons anchored to the bottom. 
- Regional language tags shown as small, high-contrast chips in the top right corner of cards.