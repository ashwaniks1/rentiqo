# ADR 0001: Cross-platform mobile stack

- **Status:** Accepted
- **Date:** 2026-05-21

## Context

Rentiqo requires simultaneous iOS and Android delivery with consistent UX and rapid iteration velocity. The team is expected to run multi-agent workflows with shared feature delivery.

## Decision

Adopt a cross-platform mobile architecture using a shared TypeScript-based stack (React Native) with selective native modules for platform-specific needs (maps, notifications, secure storage, deep links).

## Consequences

## Positive
- Faster dual-platform feature delivery.
- Shared business logic and UI primitives.
- Simplified testing strategy across platforms.

## Negative
- Native module integration complexity for advanced platform features.
- Dependency on framework ecosystem compatibility with latest OS updates.

## Follow-up actions

1. Define mobile architecture conventions and module boundaries in `docs/mobile/app-architecture.md`.
2. Validate startup performance and crash metrics on representative devices in staging.
