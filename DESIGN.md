# design.md — Riding Verse Design System (Implementation Guide)

This is the practical, code-facing companion to `docs/10-design-system.md`. That file explains the _why_; this file tells an engineer or agent exactly _how_ to use the tokens in `theme.ts` correctly, with do/don't examples. Treat this as a skill reference before writing any UI code.

---

## 1. Brand Direction in One Line

**Tarmac Orange energy on an Asphalt Black base** — motorsport-inspired, legible in direct sunlight, usable with gloves. Not a generic Material Design blue app, not a lifestyle-influencer pastel app.

## 2. The Golden Rule

> **Never write a raw hex value, raw px number, or raw font name in a component.** Always import from `theme.ts` (`Colors`, `Spacing`, `Radius`, `Fonts`, `FontSizes`, `Elevation`).

```tsx
// ❌ Don't
<View style={{ backgroundColor: '#E8422A', padding: 16, borderRadius: 12 }} />;

// ✅ Do
import { Colors, Spacing, Radius } from '@/theme';
const { colors } = useTheme(); // resolves light/dark automatically
<View
  style={{
    backgroundColor: colors.primary,
    padding: Spacing[4],
    borderRadius: Radius.md,
  }}
/>;
```

If a value you need doesn't exist in the token set, **add it to `theme.ts` first**, then use it — don't inline a one-off.

---

## 3. Color System

### 3.1 How to think about it

Colors are split into two layers:

1. **`palette`** (private, internal to `theme.ts`) — the only place raw hex lives.
2. **Semantic tokens** (`Colors.light.*` / `Colors.dark.*`) — what components actually consume. Named by _role_ (`primary`, `onSurface`, `danger`), not by _color_ (`orange500`), so dark mode is a free swap.

### 3.2 Core Palette

| Role               | Light                      | Dark                                     | Usage                                     |
| ------------------ | -------------------------- | ---------------------------------------- | ----------------------------------------- |
| `primary`          | `#E8422A` Tarmac Orange    | `#FF8A63` (lighter for dark bg contrast) | Primary CTAs, active tab, selected states |
| `accent`           | `#FFC93C` Reflector Yellow | `#FFC93C`                                | Badges, highlights, achievement moments   |
| `background`       | `#F7F8F9`                  | `#0B0F13` Asphalt                        | Screen background                         |
| `surface`          | `#FFFFFF`                  | `#101820`                                | Cards, sheets, modals                     |
| `onSurface`        | `#0B0F13`                  | `#F7F8F9`                                | Primary text                              |
| `onSurfaceVariant` | `#6B7280`                  | `#C9CFD4`                                | Secondary/muted text                      |
| `success`          | `#1FA96B`                  | `#1FA96B`                                | Verified badges, completed states         |
| `warning`          | `#F4A63A`                  | `#F4A63A`                                | Weather/geofence alerts                   |
| `danger`           | `#D7263D`                  | `#FF6B7A`                                | SOS, crash alerts, destructive actions    |

### 3.3 Usage rules

- **`danger` is reserved for safety and destructive actions only** (SOS button, crash alert, delete confirmation). Don't reuse it for generic form-validation red — that's fine, it's the same semantic meaning, but never repurpose it for something _decorative_. If you need a decorative red, that's a sign you picked the wrong color for the job — reconsider the design.
- **`accent` (yellow) is a highlight, not a background.** Use it for icons, badges, and small surface areas. Large yellow backgrounds fight the brand's asphalt/orange identity.
- Always pull colors through the `useTheme()` hook (or equivalent context) so dark mode "just works" — never conditionally pick `Colors.light.x` vs `Colors.dark.x` by hand in a component.

```tsx
// ✅ Correct dark-mode-safe pattern
function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return { colors: Colors[scheme], scheme };
}
```

---

## 4. Typography

| Token                   | Value   | Use                                                             |
| ----------------------- | ------- | --------------------------------------------------------------- |
| `Fonts.sans`            | Inter   | All body/UI text                                                |
| `Fonts.display`         | Sora    | Headings, hero numbers                                          |
| `FontSizes.sm`          | 14      | Captions, timestamps                                            |
| `FontSizes.base`        | 16      | Default body                                                    |
| `FontSizes.md`          | 18      | **Ride Mode minimum** — anything shown while riding must be ≥18 |
| `FontSizes.rideNumeric` | 28      | Live speed/distance readouts during a ride                      |
| `FontSizes.2xl` / `3xl` | 32 / 40 | Screen titles, empty-state headlines                            |

**Rule for Live Ride screens specifically:** no text below `FontSizes.md` (18px), and critical numerics (speed, distance) use `Fonts.display` at `FontSizes.rideNumeric` or larger, high-contrast against the map. This is a hard constraint from `docs/10-design-system.md` (glove-friendly, sunlight-readable).

---

## 5. Spacing & Radius

- Spacing is strictly 4px-based: `Spacing[1]` = 4, `Spacing[4]` = 16, etc. Never use an arbitrary number like `padding: 13`.
- Radius: `Radius.sm` (8) for chips/inputs, `Radius.md` (12) for standard cards, `Radius.lg` (20) for hero/media cards (event banners, club covers).

```tsx
<View
  style={{ padding: Spacing[4], gap: Spacing[3], borderRadius: Radius.md }}
/>
```

---

## 6. Elevation

Use `Elevation.card` for standard cards and `Elevation.modal` for sheets/dialogs — this already handles the iOS shadow / Android elevation split correctly. Don't hand-write `shadowOpacity`/`elevation` per component.

---

## 7. Dark Mode & Map Styling

- Dark mode must have full parity — riders use this app at dawn/dusk more than average apps.
- `Colors.light.mapStyle` / `Colors.dark.mapStyle` (`'day' | 'night'`) drive which Mapbox/Google Maps style JSON loads — wire this once in the map provider setup, not per-screen.

---

## 8. Component Patterns (Do / Don't)

### Buttons

```tsx
// ✅ Primary CTA
<Button variant="primary">Start Ride</Button>

// ✅ Destructive/SOS-adjacent
<Button variant="danger">Cancel SOS</Button>

// ❌ Don't invent a new variant inline with custom colors
<Pressable style={{ backgroundColor: '#ff0000' }}>...</Pressable>
```

### Cards

All card types (post, ride, listing, event, club) share one base `<Card>` primitive (`surface` background, `Radius.md`, `Elevation.card`, `Spacing[4]` internal padding) and differ only in content composition — don't build five one-off card components with duplicated styling.

### Empty / Loading / Error States

Every list screen must use the shared `<EmptyState>`, `<SkeletonLoader>`, and `<ErrorState>` primitives (see `docs/08-screen-flow.md` per-screen "States" fields) — don't write a bespoke "No posts yet" `<Text>` inline each time.

---

## 9. Accessibility Checklist (apply per component)

- [ ] Text/background contrast ≥ 4.5:1 (body), ≥ 3:1 (large text/icons) — verify against the semantic tokens above, not eyeballed.
- [ ] Touch targets ≥ 44×44dp (48dp preferred for Ride Mode).
- [ ] `accessibilityLabel` set on every interactive element, matching its analytics event name where practical.
- [ ] Dynamic type scaling tested up to 200%.
- [ ] Color is never the _only_ signal (e.g., pair `danger` with an icon/label, not just red).

---

## 10. Cross-Platform Consistency (Mobile ↔ Web)

`theme.ts` in `packages/ui` is the source both apps extend:

- **Mobile:** NativeWind config maps directly to `Colors`/`Spacing`/`Radius`.
- **Web:** Tailwind config (`packages/config/tailwind-base.js`) imports the same token object and generates matching utility classes (`bg-primary`, `text-on-surface`, etc.).
- If a token changes, it changes in exactly one file (`packages/ui/src/theme.ts`) and both apps rebuild consistently — this is the DRY contract from `AGENTS.md` §8.

---

## 11. Quick Reference Import

```tsx
import { Colors, Fonts, FontSizes, Spacing, Radius, Elevation } from '@/theme';
```

When in doubt: **check this file first, check `docs/10-design-system.md` second, ask before inventing a new token.**
