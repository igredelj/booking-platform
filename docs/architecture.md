# Flight Booking Platform Architecture

This repository is organized as a monorepo:

- `apps/web`: React booking frontend.
- `apps/bff`: Laravel backend-for-frontend.
- `packages/config-schema`: shared customer experience profile schema and TypeScript types.
- `mock-data`: customer experience profiles and fake backend API responses.

The React app is experience-profile-driven. Profile config controls identity, branding, theme tokens, content, composition, provider, runtime values, and approved feature flags. Laravel resolves the active experience profile, validates requests, and either calls the real airline backend API or returns mock JSON while `BOOKING_API_MODE=mock`.

Accessibility target: WCAG 2.2 AA. The first shell includes semantic landmarks, skip links, visible focus styles, labelled forms, keyboard-friendly controls, and live regions for async state.
