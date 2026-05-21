# Rentiqo Design System Baseline

## 1. Design principles

1. **Clarity over density:** prioritize essential listing decisions.
2. **Action-first:** keep save/contact/tour actions discoverable.
3. **Trust through consistency:** predictable visual and interaction patterns.
4. **Accessibility by default:** readable typography, sufficient contrast, clear targets.

## 2. Foundations

## Typography
- Primary font: system-native sans-serif (platform default).
- Scale:
  - Display
  - Heading 1/2/3
  - Body
  - Caption

## Color roles
- Primary
- Secondary
- Success
- Warning
- Error
- Surface/background
- Text (primary/secondary/inverse)

All color combinations must satisfy contrast requirements in accessibility checklist.

## Spacing
- 4px base spacing scale (4, 8, 12, 16, 24, 32, 40).

## Radius and elevation
- Consistent card/button radii.
- Elevation tokens for overlays and sticky action bars.

## 3. Component baseline

Core components:
- Button (primary, secondary, ghost, destructive)
- Text input and search input
- Filter chip and pill
- Listing card (compact/expanded)
- Agent contact card
- Tabs and segmented controls
- Bottom sheet/modal
- Snackbar/toast
- Empty/error state panel

## 4. Interaction patterns

- Preserve scroll position when returning from listing detail.
- Filter changes should be reversible and visible.
- High-intent actions require immediate visual feedback.
- Long-running actions must surface progress state.

## 5. Platform behavior standards

- iOS: respect native gestures and modal patterns.
- Android: respect back navigation and material-adjacent behavior.
- Shared design language should still feel native on each platform.

## 6. Design-to-engineering handoff

Each screen spec must include:
- Component references
- State variants (loading, empty, error, success)
- Interaction notes
- Analytics event hooks
