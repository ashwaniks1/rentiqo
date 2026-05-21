# Defect Triage Dashboard Specification

## Dashboard purpose

Centralize defect risk and release impact visibility for engineering, QA, and program owners.

## Required dimensions

- Severity (P0/P1/P2/P3)
- Status (new/in progress/fixed/verified/reopened)
- Component (backend/mobile/search/data/devops)
- Release target and regression marker
- Aging (days open)

## Core views

1. **Open critical defects**
   - All P0/P1 defects, sorted by age

2. **Release-blocking defects**
   - Defects tagged with current release milestone

3. **Regression hotspots**
   - Components with highest reopened defect counts

4. **Time-to-resolution**
   - Median time to close by severity

## Triage cadence

- Daily during active release candidate windows.
- Minimum 3 times per week during regular sprint cycles.

## Escalation policy

- P0 unresolved > 4 hours -> incident escalation.
- P1 unresolved > 24 hours in release week -> release leadership escalation.
- Reopened critical defects -> mandatory root-cause note before closure.
