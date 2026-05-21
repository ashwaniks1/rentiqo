# Rentiqo Screen Specifications (MVP)

This document defines MVP screen-level behavior and required states.

## 1. Auth screens

## Screen: Sign in / Sign up
- Purpose: authenticate user quickly.
- Required elements:
  - Email/password entry or federated sign-in options
  - Error messaging area
  - Continue CTA
- States:
  - loading submit
  - invalid credential error
  - account lock / rate limit warning

## 2. Discover screens

## Screen: Discover map/list
- Purpose: property discovery and filtering.
- Required elements:
  - Search bar (location)
  - Quick filter row
  - Map/list toggle
  - Result cards
  - Active filter chips
- States:
  - initial loading skeleton
  - zero results
  - partial data warning
  - offline retry

## Screen: Filters
- Purpose: refine result set.
- Required elements:
  - Price range
  - Beds/baths
  - Property type
  - Apply/reset controls

## 3. Listing detail screens

## Screen: Listing detail
- Purpose: evaluate property and drive action.
- Required elements:
  - Media gallery
  - Price/status block
  - Key facts
  - Description
  - Price/history summary
  - Sticky action bar (save, contact, request tour)
- States:
  - loading
  - listing unavailable
  - missing data fallback messaging

## 4. Saved screens

## Screen: Saved homes
- Purpose: quick access to shortlisted properties.
- Required elements:
  - Saved listing cards
  - Sort options
  - Remove/save state indicators

## Screen: Saved searches
- Purpose: manage search alerts.
- Required elements:
  - Criteria summary
  - Alert channel controls
  - Edit/delete actions

## 5. Inbox and engagement screens

## Screen: User inbox
- Purpose: track contact and tour updates.
- Required elements:
  - Message/lead timeline
  - Status badges
  - Quick reply/callback intent

## Screen: Contact agent
- Purpose: initiate lead.
- Required elements:
  - Message input
  - Contact preference selection
  - Submit CTA

## Screen: Tour request
- Purpose: schedule viewing intent.
- Required elements:
  - Time window picker
  - Notes input
  - Submit CTA

## 6. Profile and tools

## Screen: Profile/settings
- Purpose: account and notification management.
- Required elements:
  - Personal info summary
  - Notification controls
  - Preferences links

## Screen: Affordability calculator
- Purpose: compare monthly affordability.
- Required elements:
  - Home price, down payment, term, rate, taxes/fees inputs
  - Monthly payment output
  - Assumption disclaimer

## 7. Agent screens (MVP baseline)

## Screen: Agent lead queue
- Required elements:
  - Lead list with source, listing, and age
  - Filter by status
  - Priority indicator for stale leads

## Screen: Agent lead detail
- Required elements:
  - Lead context
  - Contact action shortcuts
  - Status update control

## 8. Admin screens (MVP baseline)

## Screen: Moderation queue
- Required elements:
  - Case list
  - Severity and reason metadata
  - Action controls

## Screen: Data quality summary
- Required elements:
  - Freshness indicators
  - Duplicate rate trend
  - Feed/source drill-down
