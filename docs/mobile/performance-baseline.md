# Mobile Performance Baseline (Stage 4)

## Baseline targets (from NFR)

- Cold start <= 3.0s
- Time to first search result <= 2.5s under normal network
- Smooth interaction target >= 50 FPS on representative devices
- Crash-free sessions >= 99.5%

## Current scaffold status

- No production telemetry yet (scaffold phase).
- Baseline measurements must be collected once API-integrated builds are available.

## Measurement plan

1. Instrument app startup timing.
2. Track API request latency from client perspective.
3. Capture crash sessions with release-channel tags.
4. Build weekly performance trend dashboard during implementation sprints.
