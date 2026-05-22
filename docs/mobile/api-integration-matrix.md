# Mobile API Integration Matrix

| Mobile area | API endpoint(s) | Integration status |
| --- | --- | --- |
| Health and environment sanity | `GET /v1/health` | Scaffolded backend route available |
| Search results | `POST /v1/search/listings` | Integrated in Discover screen |
| Listing detail | `GET /v1/listings/{listingId}` | Integrated for selected listing detail |
| User auth | `/v1/auth/login` | Demo login flow integrated |
| Saved homes | `/v1/saved-homes*` | Save/remove/list integrated |
| Saved searches and alerts | `/v1/saved-searches*` | Pending mobile UI wiring |
| Contact and tours | `/v1/listings/{listingId}/contact-agent`, `/tour-requests` | Integrated from selected listing actions |
| Inbox lead history | `GET /v1/me/leads` | Integrated in Inbox refresh |

## Integration priorities

1. Add full auth UX (manual credentials + session persistence).
2. Add saved-search management UI and alert preference controls.
3. Add richer error mapping and offline retry behavior.
4. Add agent/admin-specific mobile surfaces where applicable.
