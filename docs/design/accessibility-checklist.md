# Rentiqo Accessibility Checklist (MVP Baseline)

Target guideline: WCAG 2.1 AA-aligned mobile implementation baseline.

## 1. Visual accessibility

- [ ] Color contrast meets minimum guidance for text and controls.
- [ ] Information is not conveyed by color only.
- [ ] Text remains readable at larger font sizes.
- [ ] Minimum touch target sizes are respected.

## 2. Screen reader support

- [ ] All interactive elements have meaningful labels.
- [ ] Dynamic updates are announced where appropriate.
- [ ] Navigation order is logical and predictable.
- [ ] Decorative images are marked appropriately.

## 3. Interaction accessibility

- [ ] All critical actions are possible without complex gestures.
- [ ] Form validation errors are explicit and actionable.
- [ ] Focus indicators are visible and consistent.
- [ ] Time-sensitive flows provide enough user control.

## 4. Content and language

- [ ] Plain-language copy is used for critical decisions and errors.
- [ ] Abbreviations and jargon are minimized.
- [ ] Numeric and currency formatting are locale-aware where configured.

## 5. Motion and animation

- [ ] Motion does not trigger discomfort (avoid unnecessary movement).
- [ ] Reduced motion settings are respected where available.
- [ ] Critical information is not hidden behind animation-only cues.

## 6. Testing checklist

- [ ] iOS VoiceOver walkthrough for critical flows.
- [ ] Android TalkBack walkthrough for critical flows.
- [ ] Keyboard/focus checks for admin web surfaces.
- [ ] Accessibility issues logged with severity and reproduction steps.

## 7. Required coverage for MVP flow signoff

- Sign in / sign up
- Search and filters
- Listing detail actions
- Saved homes and saved searches
- Contact agent and tour request
- Agent lead queue baseline
