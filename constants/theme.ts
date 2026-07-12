/**
 * Riding Verse — Design Tokens
 *
 * Single source of truth for color, typography, radius, and spacing tokens
 * used across the mobile app (NativeWind/RN StyleSheet) and shared with the
 * web app's Tailwind config via `packages/ui`.
 *
 * Brand direction: "Tarmac Orange" energy on an "Asphalt Black" base —
 * motorsport-inspired but legible in direct sunlight and glove-friendly
 * ("Ride Mode"). See docs/10-design-system.md for full rationale.
 *
 * Do not hardcode hex values in components — always import from `Colors`,
 * `Spacing`, `Radius`, or `Fonts` below.
 */

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// 1. Raw brand palette (the only place hex values should ever be written)
// ---------------------------------------------------------------------------
const palette = {
  // Brand
  tarmacOrange50: '#FFF1EC',
  tarmacOrange100: '#FFD9CB',
  tarmacOrange300: '#FF8A63',
  tarmacOrange500: '#E8422A', // primary brand color
  tarmacOrange600: '#C7331E',
  tarmacOrange700: '#9C2716',

  reflectorYellow300: '#FFE08A',
  reflectorYellow500: '#FFC93C', // accent
  reflectorYellow700: '#D9A61E',

  asphalt900: '#0B0F13',
  asphalt800: '#101820', // base dark surface
  asphalt700: '#1A232C',
  asphalt600: '#242F3A',
  asphalt400: '#4B5A67',
  asphalt200: '#8C99A3',

  neutral0: '#FFFFFF',
  neutral50: '#F7F8F9',
  neutral100: '#EEF0F2',
  neutral200: '#E2E5E8',
  neutral300: '#C9CFD4',
  neutral500: '#6B7280',
  neutral700: '#3A4148',

  success500: '#1FA96B',
  success700: '#137A4C',
  warning500: '#F4A63A',
  warning700: '#C77E1E',
  danger500: '#D7263D',
  danger700: '#A81A2C',
} as const;

// ---------------------------------------------------------------------------
// 2. Semantic tokens — light & dark
//    Components should reference THESE, never `palette` directly.
// ---------------------------------------------------------------------------
const semanticLight = {
  // Backgrounds & surfaces
  background: palette.neutral50,
  surface: palette.neutral0,
  surfaceDim: palette.neutral100,
  surfaceContainer: palette.neutral100,
  surfaceContainerHigh: palette.neutral200,
  surfaceContainerHighest: palette.neutral300,
  inverseSurface: palette.asphalt800,
  inverseOnSurface: palette.neutral50,

  // Text
  onBackground: palette.asphalt900,
  onSurface: palette.asphalt900,
  onSurfaceVariant: palette.neutral500,
  onSurfaceMuted: palette.neutral500,

  // Outline
  outline: palette.neutral300,
  outlineVariant: palette.neutral200,

  // Brand
  primary: palette.tarmacOrange500,
  onPrimary: palette.neutral0,
  primaryContainer: palette.tarmacOrange100,
  onPrimaryContainer: palette.tarmacOrange700,
  inversePrimary: palette.tarmacOrange300,

  accent: palette.reflectorYellow500,
  onAccent: palette.asphalt900,
  accentContainer: palette.reflectorYellow300,
  onAccentContainer: palette.asphalt900,

  secondary: palette.asphalt600,
  onSecondary: palette.neutral0,
  secondaryContainer: palette.neutral200,
  onSecondaryContainer: palette.asphalt700,

  // Status
  success: palette.success500,
  onSuccess: palette.neutral0,
  warning: palette.warning500,
  onWarning: palette.asphalt900,
  danger: palette.danger500,
  onDanger: palette.neutral0,
  dangerContainer: '#FFE0E3',
  onDangerContainer: palette.danger700,

  // Tab bar / icons
  tabIconDefault: palette.neutral500,
  tabIconSelected: palette.tarmacOrange500,

  // Map (day style hook)
  mapStyle: 'day' as const,
};

const semanticDark = {
  background: palette.asphalt900,
  surface: palette.asphalt800,
  surfaceDim: palette.asphalt900,
  surfaceContainer: palette.asphalt700,
  surfaceContainerHigh: palette.asphalt600,
  surfaceContainerHighest: palette.asphalt400,
  inverseSurface: palette.neutral50,
  inverseOnSurface: palette.asphalt900,

  onBackground: palette.neutral50,
  onSurface: palette.neutral50,
  onSurfaceVariant: palette.neutral300,
  onSurfaceMuted: palette.asphalt200,

  outline: palette.asphalt400,
  outlineVariant: palette.asphalt600,

  primary: palette.tarmacOrange300,
  onPrimary: palette.tarmacOrange700,
  primaryContainer: palette.tarmacOrange700,
  onPrimaryContainer: palette.tarmacOrange100,
  inversePrimary: palette.tarmacOrange500,

  accent: palette.reflectorYellow500,
  onAccent: palette.asphalt900,
  accentContainer: palette.reflectorYellow700,
  onAccentContainer: palette.neutral0,

  secondary: palette.neutral300,
  onSecondary: palette.asphalt900,
  secondaryContainer: palette.asphalt600,
  onSecondaryContainer: palette.neutral200,

  success: palette.success500,
  onSuccess: palette.asphalt900,
  warning: palette.warning500,
  onWarning: palette.asphalt900,
  danger: '#FF6B7A',
  onDanger: palette.asphalt900,
  dangerContainer: palette.danger700,
  onDangerContainer: '#FFE0E3',

  tabIconDefault: palette.asphalt200,
  tabIconSelected: palette.tarmacOrange300,

  mapStyle: 'night' as const,
};

export const Colors = {
  light: {
    ...semanticLight,
    text: semanticLight.onSurface,
    background: semanticLight.background,
    tint: semanticLight.primary,
    icon: semanticLight.onSurfaceVariant,
  },
  dark: {
    ...semanticDark,
    text: semanticDark.onSurface,
    background: semanticDark.background,
    tint: semanticDark.primary,
    icon: semanticDark.onSurfaceVariant,
  },
};

// ---------------------------------------------------------------------------
// 3. Typography
// ---------------------------------------------------------------------------
export const Fonts = Platform.select({
  ios: {
    sans: 'Inter', // body/UI text
    display: 'Sora', // headings, hero numerics (speed/distance)
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'Inter',
    display: 'Sora',
    rounded: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: 'Inter',
    display: 'Sora',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    display: 'Sora, Inter, system-ui, sans-serif',
    rounded: "'SF Pro Rounded', sans-serif",
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18, // Ride Mode minimum body size
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  rideNumeric: 28, // live speed/distance readouts
} as const;

// ---------------------------------------------------------------------------
// 4. Spacing (4px base unit)
// ---------------------------------------------------------------------------
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

// ---------------------------------------------------------------------------
// 5. Radius
// ---------------------------------------------------------------------------
export const Radius = {
  sm: 4,
  md: 6, // standard card radius
  lg: 12, // hero/media card radius
  full: 999,
} as const;

// ---------------------------------------------------------------------------
// 6. Elevation (RN shadow presets — Android elevation + iOS shadow pair)
// ---------------------------------------------------------------------------
export const Elevation = {
  none: {},
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    android: { elevation: 1 },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 4 },
    default: {},
  }),
} as const;

export type ThemeColors = typeof Colors.light;
