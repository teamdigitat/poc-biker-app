---
name: Rugged Light
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5b4039'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#907067'
  outline-variant: '#e4beb4'
  surface-tint: '#b02f00'
  primary: '#b02f00'
  on-primary: '#ffffff'
  primary-container: '#ff5722'
  on-primary-container: '#541200'
  inverse-primary: '#ffb5a0'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#466270'
  on-tertiary: '#ffffff'
  tertiary-container: '#7895a4'
  on-tertiary-container: '#0e2d39'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#862200'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#c9e7f7'
  tertiary-fixed-dim: '#adcbda'
  on-tertiary-fixed: '#001f2a'
  on-tertiary-fixed-variant: '#2e4b57'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '900'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system embodies a "Rugged Modern" personality tailored for the outdoor adventure and motorsports industry. It balances raw, industrial energy with high-end digital precision. By transitioning to a light theme, the aesthetic shifts from nocturnal and mysterious to daylight clarity and high-performance functionality.

The style is **Modern-Industrial**, characterized by:
- **Clarity & Precision:** Utilizing white space to emphasize high-action photography and critical telemetry data.
- **Tectonic Depth:** Using subtle tonal shifts and hard-edged shadows to imply physical layers, reminiscent of precision-engineered equipment.
- **Aggressive Typography:** Leveraging heavy weights and tight tracking to evoke the power and speed of riding culture.

## Colors

The palette is anchored by **Electric Orange (#FF5722)**, used sparingly for critical actions and brand highlights to maintain its visual "heat." 

- **Foundation:** The interface uses a crisp `#FFFFFF` background with `#F8F8F8` as a secondary neutral for sectioning.
- **Contrast:** High-contrast text (#0D0D0D) ensures maximum readability under direct sunlight conditions, typical for outdoor riding.
- **Accents:** Deep carbon grays replace the previously dark surfaces, providing a grounded, mechanical feel without the weight of a true black background.

## Typography

The typography system relies exclusively on **Montserrat** to project confidence and geometric stability. 

- **Display & Headlines:** Use ExtraBold (800) or Black (900) weights with slightly tightened letter spacing to create a high-impact, editorial feel.
- **Body:** Standardized at 16px for optimal legibility, utilizing Medium (500) weight for secondary emphasis.
- **Labels:** Small labels and UI metadata should utilize the Bold weight and Uppercase transformation to mimic the stenciled look found on industrial machinery.

## Layout & Spacing

The design system utilizes a **Fixed Grid** philosophy on desktop (1280px max-width) and a **Fluid 4-column grid** on mobile devices.

- **Rhythm:** An 8px base unit drives all spacing decisions, ensuring a consistent mathematical harmony.
- **Density:** High-density layouts are preferred for telemetry and data-rich screens, while marketing surfaces should employ the "XL" spacing (80px) to let brand imagery breathe.
- **Margins:** Desktop margins are generous (64px) to frame the content, whereas mobile margins are tightened to 16px to maximize functional screen real estate.

## Elevation & Depth

In this light theme, elevation is defined by **Tonal Layers** and **Structured Shadows** rather than glows.

- **Base Layer:** #FFFFFF (The primary canvas).
- **Raised Layer:** #F2F2F2 with a subtle 1px border (#E0E0E0) to define card boundaries.
- **Floating Elements:** Use "Technical Shadows"—short offsets (2px to 4px) with low blur (8px) and high opacity (15%) in a neutral gray. This avoids a "dreamy" look, favoring a "bolted-on" mechanical appearance.
- **Overlays:** Use a 40% opacity black backdrop for modals to maintain focus on the rugged UI components.

## Shapes

The shape language is **Soft (0.25rem)**. While the brand is rugged, slightly softened corners suggest high-quality manufacturing and modern ergonomics. 

- **Primary Radius:** 4px (Soft) for buttons, inputs, and small cards.
- **Large Radius:** 8px (Rounded-lg) for main containers and hero sections.
- **Sharp Exceptions:** Pure 0px corners may be used for decorative elements or progress bars to emphasize a "precision instrument" vibe.

## Components

- **Buttons:** Primary buttons use the Electric Orange background with White text. Secondary buttons use a heavy 2px #1A1A1A border with Bold uppercase text.
- **Input Fields:** Use a #F8F8F8 background with a bottom-only 2px border that turns Electric Orange on focus, emphasizing a "technical gauge" feel.
- **Cards:** White backgrounds with #E0E0E0 borders. For featured content, use a "Rugged Border"—a 4px left-accent line in Electric Orange.
- **Chips/Badges:** Small, rectangular badges with #1A1A1A backgrounds and White text for status indicators (e.g., "LIVE," "OFF-ROAD").
- **Lists:** High-contrast separators using 1px #E0E0E0 lines. Icons should be monolinear and strictly #1A1A1A.
- **Progress Bars:** Use a "Segmented" appearance (blocks of color) rather than a smooth fill to represent mechanical increments.