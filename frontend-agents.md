# Riding Verse - Frontend Developer & Agent Guide

This document defines the conventions, architectural rules, and development guidelines for the web application (Next.js) and mobile application (React Native / Expo) in the Riding Verse project.

---

## 1. Prime Directives for Frontend

1. **Strict Design Token Rule**: Never write raw hex colors, pixel paddings/margins, or custom font names in components. Always import tokens from the central design system (`theme.ts` / `Spacing`, `Radius`, `Fonts`, `Colors`).
2. **No Inline HTTP Calls**: Do not use `fetch` or `axios` raw calls inside UI components. All server communication must route through the global API client wrapper.
3. **Data Caching & Server State**: Use TanStack Query (React Query) for managing, caching, and invalidating server-side data. Do not mirror query results into local state managers (like Zustand) unless explicitly handling offline drafts.
4. **Offline-First & Sensors**: Mobile-specific sensor streaming (accelerometer/gyroscope) and local caching (offline drafts) belong in mobile services. They must feed calculations into shared business logic helpers.

---

## 2. Directory Structure

### 2.1 Web App (Next.js - App Router)

```
apps/web/src/
  app/
    (marketing)/                # Public marketing pages (SSG)
    (admin)/admin/...           # Protected admin panel
    (public)/tracking/[token]/  # Live location sharing (SSR)
  components/
    ui/                         # Wraps/extends common UI primitives
    admin/                      # Specialized admin UI composites
  hooks/                        # Web-only hooks
  lib/                          # Web utilities and clients
  server/                       # Server actions and server-side contexts
```

### 2.2 Mobile App (React Native - Expo)

```
apps/mobile/src/
  app/                          # Expo Router file-based screens
  components/
    ui/                         # Wraps design tokens with native primitives
  features/                     # Domain grouping (rides, garage, safety)
    rides/
      hooks/                    # useStartRide, useLiveRide
      components/
  services/
    offlineQueue.ts             # Cache / synchronization layer
    sensors.ts                  # Accelerometer and telemetry streams
  store/                        # Session state and configuration (Zustand + MMKV)
```

---

## 3. Design System & Accessibility

- **Riding Mode Readable**: When rendering telemetry stats during active rides, font size must be $\ge 18px$ (`FontSizes.md`) to remain readable in direct sunlight and usable with gloves.
- **Dark Mode Compatibility**: Always resolve colors dynamically using `useTheme()` hook so the system swaps automatically between light and dark backgrounds.

---

## 4. API Client Integration

All components should call the central client with React Query:

```tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const useRideDetails = (id: string) => {
  return useQuery({
    queryKey: ['ride', id],
    queryFn: () => apiClient.get(`/rides/${id}`).then((res) => res.data),
  });
};
```
