# Rentiqo Mobile App Architecture (Stage 4 Baseline)

## Overview

The mobile app is structured as a modular React Native/Expo application with clear boundaries:

- `src/navigation` for app navigation and route composition
- `src/screens` for route-level UI surfaces
- `src/state` for app-level client state and session-scoped data
- future `src/api` for backend service integration
- future `src/components` for reusable UI primitives

## Current scaffolding

- Root app bootstrapping via Expo.
- Tab-oriented navigation baseline (Discover, Saved, Inbox, Profile).
- Shared state context for saved home interactions.
- Placeholder screens aligned to Stage 2 UX flow specs.

## Planned architecture evolution

1. Introduce typed API client modules by bounded context.
2. Add offline caching layer for listing and saved state resilience.
3. Introduce navigation library integration for nested route stacks.
4. Add analytics and push notification service adapters.
