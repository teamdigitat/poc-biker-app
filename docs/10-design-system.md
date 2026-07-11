# 10 — Design System

## 1. Design Principles
- **Ride Mode First:** high-contrast, large touch targets (min 48dp), glove-friendly, usable in direct sunlight.
- **India-first visual language:** vibrant but not gaudy; motorsport-inspired energy (checkered flag accents, tarmac textures) without becoming a racing-only aesthetic.
- **Trust through clarity:** verified badges, safety states, and payment flows use unambiguous, high-contrast color coding.

## 2. Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | #E8422A (Tarmac Orange) | Primary CTAs, active states |
| `--color-secondary` | #101820 (Asphalt Black) | Backgrounds, text |
| `--color-accent` | #FFC93C (Reflector Yellow) | Alerts, badges, highlights |
| `--color-success` | #1FA96B | Success states, verified badges |
| `--color-danger` | #D7263D | SOS, crash alerts, destructive actions |
| `--color-warning` | #F4A63A | Warnings (weather, geofence) |
| `--color-surface` | #FFFFFF / #1A1F26 (dark) | Cards, sheets |
| `--color-muted` | #6B7280 | Secondary text |

## 3. Typography
- **Primary typeface:** Inter (UI text), Sora (headings/branding) — both support Latin + Indic script fallback via Noto Sans variants for localization.
- **Scale:** 12 / 14 / 16 (body) / 20 / 24 / 32 / 40 (display)
- **Ride Mode scale:** minimum 18px body text, 28px for critical live-ride numerics (speed, distance).

## 4. Spacing & Layout
- 4px base spacing unit; scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Safe-area aware layouts for all screens (notch, gesture bar).
- Card corner radius: 12px standard, 20px for hero/media cards.

## 5. Iconography
- Outline-style icon set (Lucide-based) for standard UI; filled/duotone variant for active/selected tab states.
- Custom icon set required for: motorcycle types (cruiser, adventure, sportbike, off-road), SOS, crash detection, geofence, badges.

## 6. Component Library (NativeWind + shared primitives)
- Button (primary/secondary/ghost/destructive, with loading state)
- Input (text, OTP, phone, search) with validation state styling
- Card (post card, ride card, listing card, event card, club card)
- Avatar (with verified badge overlay, online indicator)
- Bottom Sheet (used for filters, quick actions, SOS confirmation)
- Map Marker set (rider, hazard, fuel, EV, hotel, mechanic, event)
- Badge/Chip (status, category, achievement)
- Skeleton Loader (per card type)
- Empty State (illustration + message + CTA)
- Toast/Snackbar (success/error/info)
- Modal (standard, full-screen critical — SOS/crash)
- Stepper (onboarding, career roadmap, checkout)
- Progress Ring (ride stats, course completion)
- Tab Bar (bottom, and in-page segmented tabs)

## 7. Motion & Haptics
- Reanimated-driven micro-interactions: button press scale (0.97), card entrance fade+slide.
- Haptic feedback: light impact on toggle/select, medium on primary action confirm, heavy/error pattern on SOS trigger and crash detection.
- Live tracking marker movement uses smoothed interpolation (no jump snapping) between GPS updates.

## 8. Dark Mode
- Full dark mode parity required from MVP (riders frequently use app at night/early morning).
- Map style switches automatically (day/night Mapbox style) tied to device theme + time-of-day heuristic.

## 9. Accessibility Tokens
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text/icons.
- All interactive elements have accessible labels (`accessibilityLabel`) mapped to analytics event names for consistency.
- Dynamic type scaling supported up to 200%.

## 10. Localization Design Considerations
- Text expansion buffer: layouts must tolerate 30–40% longer text for Hindi/regional scripts vs English.
- Right-alignment not required (no RTL languages in MVP scope), but component library built RTL-ready for future Urdu/Arabic expansion.

## 11. Brand Assets Checklist
- Primary logo (light/dark), app icon (adaptive icon for Android), splash logo animation, social share card templates (ride summary, achievement unlock, event invite).
